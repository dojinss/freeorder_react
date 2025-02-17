package com.aloha.freeorder.domain;

import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Product {

    private String id;
    private String optionsId;
    private String name;
    private String categoriesId;
    private String description;
    private String content;
    private String productImg;
    private int price;
    private boolean stockCheck;
    private int stock;
    private int seq;
    private Date createdAt;
    private Date updatedAt;
    private boolean isPopular;          // 인기메뉴 판단    : 100건이상
    private boolean isNew;              // 신메뉴 판단      : 2주이내 생성
    private boolean isRecommended;      // 추천메뉴 판단    : recomend_products 테이블에 존재
    private boolean checkRecommend;     // 추천메뉴 설정    : html 단에 체크박스로 유무판단해서 전달 받음
    private MultipartFile productFile;
    private Option option;
    private int quantity;
}
