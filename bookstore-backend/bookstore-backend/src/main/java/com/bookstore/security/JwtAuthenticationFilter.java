package com.bookstore.security;

import com.bookstore.service.UserService;
import com.bookstore.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collections;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println(">>> Incoming request to: " + request.getRequestURI());
        System.out.println(">>> Authorization Header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtUtil.extractUsername(token);
                System.out.println(">>> Extracted email: " + email);

                if (email != null && jwtUtil.validateToken(token, email)) {
                	
                	// Block token usage if account is inactive
                    var user = userService.getByEmail(email);
                    if (user == null || !user.isActive()) {
                        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Account is deactivated");
                        return;
                    }
                    
                    System.out.println(">>> Token is valid. Setting userEmail attribute.");
                    request.setAttribute("userEmail", email);
                    
                    String role = jwtUtil.extractRole(token);
                    var authority = new org.springframework.security.core.authority.SimpleGrantedAuthority(role);

                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, java.util.List.of(authority));

                    SecurityContextHolder.getContext().setAuthentication(authentication);


                } else {
                    System.out.println(">>> Token is invalid or email is null.");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                    return;
                }
            } catch (Exception e) {
                System.out.println(">>> JWT Exception: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        } else if (request.getRequestURI().startsWith("/api/user/")) {
            System.out.println(">>> No token provided for protected endpoint.");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is missing");
            return;
        }

        filterChain.doFilter(request, response);
    }

}
