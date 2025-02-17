package com.aloha.freeorder.domain;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class Option {
    
    private String id;
    private String name;
    private boolean stockCheck;
    private int stock;
    private boolean essential;
    private int selectMin;
    private int selectMax;
    private Date createdAt;
    private Date updatedAt;
    private List<OptionItem> itemList;
}
