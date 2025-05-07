
    package com.example.demo;

    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    public class Controller {

        @GetMapping("/data")
        public String getData() {
            return "Here is your data!";
        }
    }
    