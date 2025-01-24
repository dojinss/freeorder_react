package com.aloha.freeorder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.aloha.freeorder.domain.Order;
import com.aloha.freeorder.service.OrderService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@CrossOrigin("*")
public class MainOrdersController {

    // orderService 호출
    @Autowired
    private OrderService orderService;

    // 주문 전송 (/app/order.addorder/{ordersId})
    @MessageMapping("/order.addorder/{id}")
    @SendTo("/orders")
    public Order sendMessage(Order receiveOrder) throws Exception {
        String ordersId = receiveOrder.getId();
        log.info("ordersId: " + ordersId);
        Order order = orderService.read(ordersId);
        log.info("order: {}", order);
        return order;
    }
}
