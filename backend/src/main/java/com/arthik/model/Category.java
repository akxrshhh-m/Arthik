package com.arthik.model;

import java.time.LocalDateTime;

public class Category {
    private Long id;
    private String name;
    private String type; // INCOME or EXPENSE
    private String icon;
    private String color;
    private Long userId; // null for system defaults
    private LocalDateTime createdAt;

    public Category() {}

    public Category(Long id, String name, String type, String icon, String color, Long userId, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.icon = icon;
        this.color = color;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
