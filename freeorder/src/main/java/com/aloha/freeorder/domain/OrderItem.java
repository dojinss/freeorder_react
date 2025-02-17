package com.aloha.freeorder.domain;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OrderItem {

    private String id;
    private String ordersId;
    private String productsId;
    private String optionsId;
    private String name;
    private int quantity;
    private int price;
    private int amount;
    private Date createdAt;
    private Date updatedAt;
    private List<OrderOption> optionList;
}
