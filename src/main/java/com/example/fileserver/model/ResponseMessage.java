package com.example.fileserver.model;

public class ResponseMessage {
    private String message;

    public ResponseMessage(final String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(final String message) {
        this.message = message;
    }
}
