package com.pawject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pawject API")
                        .description("Spring Boot + JWT + Redis + OAuth2 인증 API 문서")
                        .version("v1.0"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .addSecurityItem(new SecurityRequirement().addList("oauth2-google"))
                .addSecurityItem(new SecurityRequirement().addList("oauth2-kakao"))
                .addSecurityItem(new SecurityRequirement().addList("oauth2-naver"))
                .components(new io.swagger.v3.oas.models.Components() 
                			// JWT Bearer 인증스키마
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .name("Authorization")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")) 
            			    // Google oauth2
                        .addSecuritySchemes("oauth2-google",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.OAUTH2)
                                        .flows(new OAuthFlows()
                                                .authorizationCode(new OAuthFlow()
                                                        .authorizationUrl("/oauth2/authorization/google")
                                                        .tokenUrl("/login/oauth2/code/google")))) 
        			        // Kakao oauth2
                        .addSecuritySchemes("oauth2-kakao",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.OAUTH2)
                                        .flows(new OAuthFlows()
                                                .authorizationCode(new OAuthFlow()
                                                        .authorizationUrl("/oauth2/authorization/kakao")
                                                        .tokenUrl("/login/oauth2/code/kakao")))) 
    			           // Naver oauth2
                        .addSecuritySchemes("oauth2-naver",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.OAUTH2)
                                        .flows(new OAuthFlows()
                                                .authorizationCode(new OAuthFlow()
                                                        .authorizationUrl("/oauth2/authorization/naver")
                                                        .tokenUrl("/login/oauth2/code/naver")))));
    }
}
