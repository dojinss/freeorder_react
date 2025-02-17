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
public class Order {
    
    private String id;
    private int orderNumber;
    private String type;
    private String usersId;
    private String title;
    private int totalQuantity;
    private int totalCount;
    private int totalPrice;
    private String status;
    private Date orderedAt;
    private Date createdAt;
    private Date updatedAt;
    private List<OrderItem> itemList;

}
