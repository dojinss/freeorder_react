package com.aloha.freeorder.controller.pos;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.freeorder.domain.Cart;
import com.aloha.freeorder.domain.CartOption;
import com.aloha.freeorder.domain.CustomUser;
import com.aloha.freeorder.domain.Order;
import com.aloha.freeorder.domain.OrderItem;
import com.aloha.freeorder.domain.OrderOption;
import com.aloha.freeorder.domain.PaySearch;
import com.aloha.freeorder.domain.Payment;
import com.aloha.freeorder.domain.SystemStatus;
import com.aloha.freeorder.domain.Users;
import com.aloha.freeorder.service.CartService;
import com.aloha.freeorder.service.OrderService;
import com.aloha.freeorder.service.PaymentService;

import lombok.extern.slf4j.Slf4j;

/**
 * REST 형식 컨트롤러
 * CRUD 비동기 처리
 * 
 */
@Slf4j
@RestController
@RequestMapping("/pos/payments")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private CartService cartService;

    /**
     * Payment
     */
    // 결제 내역 목록
    @GetMapping()
    public ResponseEntity<?> showPaymentPage(PaySearch paySearch) throws Exception {
        log.info("결제내역 페이지");
        log.info(" 서치 옵션 : " + paySearch);
        // 검색 값이 없을경우 기본값 세팅
        if (paySearch == null || paySearch.getDate() == 0) {
            paySearch = PaySearch.builder().date(7).build();
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar c = Calendar.getInstance();
        String stDate = sdf.format(c.getTime());
        paySearch.setEndDay(stDate);
        c.add(Calendar.DATE, -paySearch.getDate());
        String endDate = sdf.format(c.getTime());
        paySearch.setStartDay(endDate);
        log.info(paySearch.toString());

        List<Payment> payList = paymentService.listByOption(paySearch);
        log.info("결제 리스트 : " + payList.toString());
        return new ResponseEntity<>(payList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") String id) {
        log.info("결제내역 조회");
        try {
            Payment payment = paymentService.select(id);
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (Exception e) {
            log.error("결제내역 조회 중 에러...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> create(
            @PathVariable("id") String usersId,
            @RequestBody Payment payment,
            @CookieValue(value = "orderType", defaultValue = "") String orderType) {
        log.info("결제내역 등록");
        log.info("결제 정보 : " + payment.getPaymentMethod());
        try {
            // 장바구니 정보 불러오기
            List<Cart> cartList = cartService.listByUser(usersId);
            int total = 0;

            // 주문 ID 생성
            String ordersId = UUID.randomUUID().toString();

            String title = "";
            Order order = Order.builder()
                    .id(ordersId)
                    .usersId(usersId)
                    .totalPrice(total)
                    .totalQuantity(cartList.size())
                    .status("COMPLETE")
                    .build();
            List<OrderItem> itemList = new ArrayList<>();
            
            for (Cart cart : cartList) {
                List<CartOption> optionList = cart.getOptionList();
                total += cart.getPrice() * cart.getAmount();
                for (CartOption cartOption : optionList) {
                    total += cartOption.getPrice() * cart.getAmount();
                }
                if (title.equals("")) {
                    title = cart.getProductName();
                }
                String orderItemId = UUID.randomUUID().toString();
                OrderItem orderItem = OrderItem.builder()
                        .id(orderItemId)
                        .ordersId(ordersId)
                        .productsId(cart.getProductsId())
                        .optionsId(cart.getOptionsId())
                        .quantity(cart.getAmount())
                        .name(cart.getProductName())
                        .price(cart.getPrice())
                        .amount(cart.getAmount() * cart.getPrice())
                        .build();

                List<CartOption> cartOptionList = cart.getOptionList();
                List<OrderOption> orderOptionList = new ArrayList<>();

                // 옵션
                int optionAmount = 0;
                for (CartOption cartOption : cartOptionList) {
                    OrderOption orderOption = OrderOption.builder()
                            .id(UUID.randomUUID().toString())
                            .optionItemsId(cartOption.getOptionItemsId())
                            .orderItemsId(orderItemId)
                            .name(cartOption.getName())
                            .price(cartOption.getPrice())
                            .build();
                    orderOptionList.add(orderOption);
                    optionAmount += cartOption.getPrice();
                }
                orderItem.setOptionList(orderOptionList);
                orderItem.setAmount(cart.getAmount() * cart.getPrice() + optionAmount);
                itemList.add(orderItem);
            }

            order.setItemList(itemList);
            if (itemList.size() > 1) {
                title += "외" + (itemList.size() - 1) + "건";
            }
            order.setTitle(title);
            order.setTotalPrice(total);
            order.setType("HERE");
            log.info("order: " + order);
            // 주문등록
            orderService.insert(order);

            // 결제 정보 세팅
            Payment insertPayment = Payment.builder()
                    .id(UUID.randomUUID().toString())
                    .ordersId(ordersId)
                    .paymentMethod(payment.getPaymentMethod())
                    .paymentKey(UUID.randomUUID().toString())
                    .status("PAID")
                    .build();
            // 결제내역 등록
            int result = paymentService.insert(insertPayment);
            if (result > 0) {
                cartService.allDeleteByUserId(usersId); // 장바구니 비우기
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            } else {
                log.info("결제내역 DB에 등록 중 에러...");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("결제내역 등록 중 에러...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping()
    public ResponseEntity<?> update(Payment payment) {
        log.info("결제내역 수정");
        try {
            int result = paymentService.update(payment);
            if (result > 0)
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            else {
                log.info("결제내역 DB에서 수정 중 에러...");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("결제내역 수정 중 에러...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable("id") String id) {
        log.info("결제내역 삭제");
        try {
            int result = paymentService.delete(id);
            if (result > 0)
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            else {
                log.info("결제내역 DB에서 삭제 중 에러...");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("결제내역 삭제 중 에러...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
