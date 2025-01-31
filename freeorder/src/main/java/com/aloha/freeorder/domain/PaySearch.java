package com.aloha.freeorder.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PaySearch {

    private int date;
    private String startDay;
    private String endDay;
    private String paymentMethods;
    private Integer minPrice;
    private Integer maxPrice;

}
