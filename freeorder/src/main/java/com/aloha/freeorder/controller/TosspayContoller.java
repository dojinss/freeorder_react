package com.aloha.freeorder.controller;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.freeorder.domain.Cart;
import com.aloha.freeorder.domain.CartOption;
import com.aloha.freeorder.domain.Order;
import com.aloha.freeorder.domain.OrderItem;
import com.aloha.freeorder.domain.OrderOption;
import com.aloha.freeorder.domain.Payment;
import com.aloha.freeorder.service.CartService;
import com.aloha.freeorder.service.OrderService;
import com.aloha.freeorder.service.PaymentService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/payments")
@CrossOrigin("*")
public class TosspayContoller {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private CartService cartService;

    @GetMapping("/{id}/{orderType}")
    public ResponseEntity<?> payment(
            @PathVariable("id") String usersId,
            @PathVariable("orderType") String orderType) throws Exception {
        log.info("결제 창 출력!!");
        log.info("유저 아이디 : " + usersId);
        // 장바구니 정보 불러오기
        List<Cart> cartList = cartService.listByUser(usersId);
        Integer total = 0;

        // 주문 ID 생성
        String ordersId = UUID.randomUUID().toString();

        String title = "";
        Order order = Order.builder()
                .id(ordersId)
                .usersId(usersId)
                .totalPrice(total)
                .totalQuantity(cartList.size())
                .status("PENDING")
                .build();
        List<OrderItem> itemList = new ArrayList<>();

        for (Cart cart : cartList) {
            List<CartOption> optionList = cart.getOptionList();
            int optionTotal = 0;

            for (CartOption cartOption : optionList) {
                optionTotal += cartOption.getPrice();
            }
            total += (cart.getPrice() + optionTotal) * cart.getAmount();
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
        order.setType(orderType);
        log.info("order: " + order);
        int result = orderService.insert(order);
        if (result > 0) {
            cartService.delete(usersId);
            log.info("주문내역 생성 성공!!");
        } else {
            log.info("주문내역 생성 실패!!");
        }

        log.info("타이틀: " + title);
        log.info("오더아이디: " + ordersId);
        log.info("총금액 : " + total);

        Map<String, String> response = new HashMap<String, String>();
        response.put("title", title);
        response.put("ordersId", ordersId);
        response.put("total", total.toString());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/confirm")
    public ResponseEntity<JSONObject> confirmPayment(
            @RequestBody String jsonBody) throws Exception {
        log.info("결제성공 후 프로그램 DB에 연동 시도...");
        log.info(jsonBody);
        JSONParser parser = new JSONParser();
        String ordersId;
        String amount;
        String paymentKey;
        try {
            // 클라이언트에서 받은 JSON 요청 바디입니다.
            JSONObject requestData = (JSONObject) parser.parse(jsonBody);
            paymentKey = (String) requestData.get("paymentKey");
            ordersId = (String) requestData.get("orderId");
            amount = (String) requestData.get("amount");
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        JSONObject obj = new JSONObject();
        obj.put("orderId", ordersId);
        obj.put("amount", amount);
        obj.put("paymentKey", paymentKey);

        // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
        // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
        String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);

        // 결제를 승인하면 결제수단에서 금액이 차감돼요.
        URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Authorization", authorizations);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        OutputStream outputStream = connection.getOutputStream();
        outputStream.write(obj.toString().getBytes("UTF-8"));

        int code = connection.getResponseCode();
        boolean isSuccess = code == 200;

        InputStream responseStream = isSuccess ? connection.getInputStream() : connection.getErrorStream();

        // 결제 성공 및 실패 비즈니스 로직을 구현하세요.
        Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
        JSONObject jsonObject = (JSONObject) parser.parse(reader);

        responseStream.close();
        log.info("로그" + jsonObject.toJSONString());

        Payment payment = Payment.builder()
                .id(UUID.randomUUID().toString())
                .ordersId(ordersId)
                .paymentMethod("카드")
                .paymentKey(paymentKey)
                .build();

        if (isSuccess) {

            JSONObject responseJson = new JSONObject();
            // 결제 성공 처리 로직
            log.info("결제 성공: ordersId={}, amount={}", ordersId, amount);

            // 데이터베이스에 결제 상태 업데이트
            payment.setStatus("PAID");
            paymentService.insert(payment);
            Order order = Order.builder().id(ordersId).status("PAID").build();
            orderService.update(order);
            Order userOrder = orderService.read(ordersId);
            String usersId = userOrder.getUsersId();
            log.info(" 결제 성공 이후 장바구니 삭제할 유저아이디 : " + usersId);
            cartService.allDeleteByUserId(usersId);

            responseJson.put("status", "success");
            responseJson.put("message", "Payment confirmed successfully.");
            return ResponseEntity.ok(responseJson);
        } else {

            log.error("결제 실패: ordersId={}, code={}, message={}", ordersId, code, jsonObject.get("message"));
            JSONObject responseJson = new JSONObject();
            // 결제 실패 처리 로직

            responseJson.put("status", "failure");
            responseJson.put("message", "Payment confirmation failed. Please try again.");
            return ResponseEntity.status(code).body(responseJson);
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> paymentCancel(
            Order order,
            @RequestParam String paymentKey,
            @RequestParam String reason) {
        // CancellationService.cancelPayment(order.getId(), paymentKey, reason);
        // log.info(order.toString());
        // HttpRequest request = HttpRequest.newBuilder()
        // .uri(URI.create("https://api.tosspayments.com/v1/payments/orders/a4CWyWY5m89PNh7xJwhk1"))
        // .header("Authorization", "Basic
        // dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==")
        // .header("Content-Type", "application/json")
        // .method("POST", HttpRequest.BodyPublishers.noBody())
        // .build();
        // HttpResponse<String> response = HttpClient.newHttpClient().send(request,
        // HttpResponse.BodyHandlers.ofString());
        // System.out.println(response.body());
        return ResponseEntity.ok().body("cancel success");
    }

}
