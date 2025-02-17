package com.aloha.freeorder.domain;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Cart {
    private String id;
    private String productsId;
    private String usersId;
    private String optionsId;
    private String productName;
    private int amount;
    private int price;
    private Date createdAt;
    private Date updatedAt;
    private List<CartOption> optionList;
}
