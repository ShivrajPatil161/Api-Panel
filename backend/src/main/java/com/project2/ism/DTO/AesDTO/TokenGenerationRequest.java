package com.project2.ism.DTO.AesDTO;




public class TokenGenerationRequest {


    private String username;
    private String password;
    private String salt;
    private String ivBase64;


    public TokenGenerationRequest() {
    }

    public TokenGenerationRequest(String username, String password, String salt, String ivBase64) {
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.ivBase64 = ivBase64;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getIvBase64() {
        return ivBase64;
    }

    public void setIvBase64(String ivBase64) {
        this.ivBase64 = ivBase64;
    }
}
