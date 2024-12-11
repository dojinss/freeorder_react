package com.aloha.freeorder.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.freeorder.domain.Cart;
import com.aloha.freeorder.domain.CartOption;
import com.aloha.freeorder.mapper.CartMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CartServiceImpl implements CartService{

    @Autowired
    private CartMapper cartMapper;
    
    @Override
    public Cart select(String id) throws Exception {
        return cartMapper.select(id);
    }

    @Override
    public List<Cart> list() throws Exception {
        return cartMapper.list();
    }

    @Override
    public int insert(Cart cart) throws Exception {
        return cartMapper.insert(cart);
    }

    @Override
    public int update(Cart cart) throws Exception {
        return cartMapper.update(cart);
    }

    @Override
    public int delete(String id) throws Exception {
        return cartMapper.delete(id);
    }

    @Override
    public List<Cart> listByUser(String usersId) throws Exception {
        return cartMapper.listByUser(usersId);
    }

    @Override
    public int insertOption(CartOption cartOption) throws Exception {
        return cartMapper.insertOption(cartOption);
    }

    @Override
    public int deleteOption(String id) throws Exception {
        return cartMapper.deleteOption(id);
    }
    
}
