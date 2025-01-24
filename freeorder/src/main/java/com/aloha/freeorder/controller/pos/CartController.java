package com.aloha.freeorder.controller.pos;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.freeorder.domain.Cart;
import com.aloha.freeorder.domain.CartOption;
import com.aloha.freeorder.domain.CustomUser;
import com.aloha.freeorder.domain.Option;
import com.aloha.freeorder.domain.OptionItem;
import com.aloha.freeorder.domain.Product;
import com.aloha.freeorder.domain.Users;
import com.aloha.freeorder.security.props.JwtProps;
import com.aloha.freeorder.service.CartService;
import com.aloha.freeorder.service.ProductService;
import com.aloha.freeorder.util.OptionComparator;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

/**
 * REST 형식 컨트롤러
 * CRUD 비동기 처리
 * 
 */
@Slf4j
@RestController
@RequestMapping("/pos/carts")
@CrossOrigin("*")
public class CartController {

    @Autowired private JwtProps jwtProps;  // secretKey 

    @Autowired
    private CartService cartService;
    @Autowired
    private ProductService productService;

    @GetMapping()
    public ResponseEntity<?> getAll(@RequestHeader(name = "Authorization") String authorization) {

        // Authrization : "Bearer " + 💍(jwt)
        String jwt = authorization.substring(7);
        String secretKey = jwtProps.getSecretKey();
        byte[] signingKey = secretKey.getBytes();

        log.info("장바구니 목록 조회");

        // JWT 토큰 해석 : 💍 ➡ 👩‍💼
        Jws<Claims> parsedToken = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(signingKey))
                .build()
                .parseSignedClaims(jwt);
        String usersId = parsedToken.getPayload().get("username").toString();

        log.info("username : " + usersId);
        try {
            List<Cart> cartList = cartService.listByUser(usersId);
            // log.info(cartList.toString());
            return new ResponseEntity<>(cartList, HttpStatus.OK);
        } catch (Exception e) {
            log.error("장바구니 목록 조회 중 에러...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") String id) {
        log.info("장바구니 조회");
        try {
            Cart cart = cartService.select(id);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (Exception e) {
            log.error("장바구니 조회 중 에러...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> create(@RequestBody Product product,
            @PathVariable("id") String usersId) {
        log.info("상품 정보 출력 : " + product);
        log.info("장바구니 목록 추가");
        try {
            Product infoProduct = productService.select(product.getId());
            // log.info("infoProdsuct : " + infoProduct);

            String id = UUID.randomUUID().toString();
            Cart cart = new Cart();
            cart.setId(id);
            cart.setProductName(infoProduct.getName());
            cart.setProductsId(product.getId());
            // log.info("product : " + product);
            Option option = product.getOption();
            if (option != null) {
                log.info("option null 아님");
                List<OptionItem> getOpList = option.getItemList();
                log.info(getOpList.toString());
                List<CartOption> optionList = new ArrayList<>();
                for (OptionItem optionItem : getOpList) {
                    if (optionItem.isChecked()) {
                        CartOption cartOption = CartOption.builder()
                                .id(UUID.randomUUID().toString())
                                .cartsId(id)
                                .usersId(usersId)
                                .name(optionItem.getName())
                                .optionItemsId(optionItem.getId())
                                .build();
                        optionList.add(cartOption);
                    }
                }
                cart.setOptionList(optionList);
                cart.setOptionsId(option.getId());
            }
            cart.setPrice(infoProduct.getPrice());
            cart.setAmount(product.getQuantity());
            cart.setUsersId(usersId);
            // log.info("카트 정보 : " + cart.toString());
            List<Cart> existCartList = cartService.ListByUsersIdAndProductsId(usersId, product.getId());
            // log.info("existCartList : " + existCartList);
            if (existCartList != null)
                for (Cart existCart : existCartList) {

                    if (existCart == null || cart == null)
                        continue;

                    List<CartOption> existCartOptionList = existCart.getOptionList();
                    List<CartOption> cartOptionList = cart.getOptionList();

                    log.info("existCart : " + existCart);
                    log.info("cart : " + cart);
                    

                    if ((existCartOptionList == null && cartOptionList == null) || OptionComparator.areOptionListsEqual(existCartOptionList, cartOptionList)) {
                        log.info("장바구니 개수 증가");
                        existCart.setAmount(existCart.getAmount() + cart.getAmount());
                        cartService.updateAmount(existCart);
                        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
                    }
                }
            if (option != null) {
                for (CartOption cartOption : cart.getOptionList()) {
                    cartService.insertOption(cartOption);
                }
            }
            cartService.insert(cart);
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            log.error("장바구니 추가 중 에러 발생", e);
            return new ResponseEntity<>("추가중 에러발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping()
    public ResponseEntity<?> update(Cart cart) {
        log.info("장바구니 수정");
        try {
            int result = cartService.update(cart);
            if (result > 0)
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            else {
                log.info("장바구니 DB에서 수정 중 에러...");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("장바구니 수정 중 에러...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/plus/{id}")
    public void quantitiyPlus(@PathVariable("id") String id) throws Exception {
        log.info(id + " 해당 장바구니 수량 증가 ( +1 ) ");
        Cart oldCart = cartService.select(id);
        int amount = oldCart.getAmount();
        if (amount < 100) {
            oldCart.setAmount(amount + 1);
        }
        cartService.updateAmount(oldCart);
    }

    @PutMapping("/minus/{id}")
    public void quantitiyMinus(@PathVariable("id") String id) throws Exception {
        log.info(id + " 해당 장바구니 수량 감소 ( -1 ) ");
        Cart oldCart = cartService.select(id);
        int amount = oldCart.getAmount();
        if (amount > 1) {
            oldCart.setAmount(amount - 1);
        }
        cartService.updateAmount(oldCart);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable("id") String id) {
        log.info("장바구니 삭제");
        try {
            int result = cartService.delete(id);
            if (result > 0)
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            else {
                log.info("장바구니 DB에서 삭제 중 에러...");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("장바구니 삭제 중 에러...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/all/{id}")
    public ResponseEntity<?> destroyAll(@PathVariable("id") String usersId) {
        log.info("장바구니 목록 전체 삭제");
        try {
            int result = cartService.allDeleteByUserId(usersId);
            if (result > 0) {
                cartService.allDeleteOptionByUserId(usersId);
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("장바구니 삭제 중 에러 발생", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
