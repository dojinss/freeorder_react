package com.aloha.freeorder.handler;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aloha.freeorder.security.provider.JwtProvider;

@Component
public class StompHandler implements ChannelInterceptor {

    private final JwtProvider jwtProvider;

    public StompHandler(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @SuppressWarnings("unlikely-arg-type")
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        // Stomp 헤더 액세스
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        // CONNECT 명령어에서만 토큰 검증
        if ("CONNECT".equals(accessor.getCommand())) {
            // Authorization 헤더에서 JWT 토큰 추출
            String token = accessor.getFirstNativeHeader("Authorization");
            if (token == null) {
                throw new IllegalArgumentException("JWT token is Null");
            }
            if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
                token = token.substring(7); // "Bearer " 부분 제거
            }
            // JWT 유효성 검증
            if (!jwtProvider.validateToken(token)) {
                throw new IllegalArgumentException("Invalid JWT token");
            }

            // 인증된 사용자 정보 추가 (선택적)
            UsernamePasswordAuthenticationToken userInfo = jwtProvider.getAuthenticationToken(token);
            UserDetails userDetails = (UserDetails) userInfo.getDetails();
            String username = userDetails.getUsername();
            accessor.setUser(() -> username); // WebSocket 세션에 사용자 정보 추가
            SecurityContextHolder.getContext().setAuthentication(userInfo);
        }

        return message;
    }
}