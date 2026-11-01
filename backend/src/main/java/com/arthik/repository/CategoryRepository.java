package com.arthik.repository;

import com.arthik.model.Category;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    public CategoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Category> categoryRowMapper = (rs, rowNum) -> {
        Category cat = new Category();
        cat.setId(rs.getLong("id"));
        cat.setName(rs.getString("name"));
        cat.setType(rs.getString("type"));
        cat.setIcon(rs.getString("icon"));
        cat.setColor(rs.getString("color"));
        long userId = rs.getLong("user_id");
        cat.setUserId(rs.wasNull() ? null : userId);
        cat.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        return cat;
    };

    public List<Category> findAllForUser(Long userId) {
        String sql = "SELECT id, name, type, icon, color, user_id, created_at FROM categories " +
                     "WHERE user_id IS NULL OR user_id = ? ORDER BY type, name";
        return jdbcTemplate.query(sql, categoryRowMapper, userId);
    }

    public Optional<Category> findById(Long id) {
        String sql = "SELECT id, name, type, icon, color, user_id, created_at FROM categories WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, categoryRowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
