package com.aloha.freeorder.controller.qr;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.freeorder.domain.Payment;
import com.aloha.freeorder.service.PaymentService;

import lombok.extern.slf4j.Slf4j;

/**
 * REST 형식 컨트롤러
 * CRUD 비동기 처리
 * 
 */
@Slf4j
@RestController
@RequestMapping("/qr/payments")
@CrossOrigin("*")
public class QrPaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @GetMapping()
    public ResponseEntity<?> getAll() {
        try {
            List<Payment> paymentList = paymentService.list();
            return new ResponseEntity<>(paymentList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable String id) {
        try {
            Payment payment = paymentService.select(id);
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping()
    public ResponseEntity<?> create(@RequestBody Payment payment) {
        try {
            int result = paymentService.insert(payment);
            if ( result > 0 ) {
                return new ResponseEntity<>("SUCCESS", HttpStatus.CREATED);
            }
            else {
                return new ResponseEntity<>("FAIL", HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping()
    public ResponseEntity<?> update(@RequestBody Payment payment) {
        try {
            int result = paymentService.update(payment);
            if ( result > 0 ) {
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>("FAIL", HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable String id) {
        try {
            int result = paymentService.delete(id);
            if ( result > 0 ) {
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>("FAIL", HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
