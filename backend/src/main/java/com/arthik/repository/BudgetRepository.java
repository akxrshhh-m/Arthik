package com.arthik.repository;

import com.arthik.model.Budget;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class BudgetRepository {

    private final JdbcTemplate jdbcTemplate;

    public BudgetRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Budget> budgetRowMapper = (rs, rowNum) -> {
        Budget b = new Budget();
        b.setId(rs.getLong("id"));
        b.setUserId(rs.getLong("user_id"));
        b.setCategoryId(rs.getLong("category_id"));
        b.setCategoryName(rs.getString("category_name"));
        b.setCategoryColor(rs.getString("category_color"));
        b.setCategoryIcon(rs.getString("category_icon"));
        b.setMonthYear(rs.getString("month_year"));
        b.setAmountLimit(rs.getBigDecimal("amount_limit"));
        b.setSpentAmount(rs.getBigDecimal("spent_amount"));
        b.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        return b;
    };

    public List<Budget> findAllByUserIdAndMonth(Long userId, String monthYear) {
        String sql = "SELECT b.id, b.user_id, b.category_id, c.name AS category_name, c.color AS category_color, " +
                     "c.icon AS category_icon, b.month_year, b.amount_limit, " +
                     "COALESCE((SELECT SUM(t.amount) FROM transactions t WHERE t.user_id = b.user_id " +
                     "AND t.category_id = b.category_id AND t.type = 'EXPENSE' " +
                     "AND DATE_FORMAT(t.transaction_date, '%Y-%m') = b.month_year), 0) AS spent_amount, " +
                     "b.created_at " +
                     "FROM budgets b " +
                     "JOIN categories c ON b.category_id = c.id " +
                     "WHERE b.user_id = ? AND b.month_year = ? " +
                     "ORDER BY c.name ASC";
        return jdbcTemplate.query(sql, budgetRowMapper, userId, monthYear);
    }

    public Optional<Budget> findByIdAndUserId(Long id, Long userId) {
        String sql = "SELECT b.id, b.user_id, b.category_id, c.name AS category_name, c.color AS category_color, " +
                     "c.icon AS category_icon, b.month_year, b.amount_limit, " +
                     "COALESCE((SELECT SUM(t.amount) FROM transactions t WHERE t.user_id = b.user_id " +
                     "AND t.category_id = b.category_id AND t.type = 'EXPENSE' " +
                     "AND DATE_FORMAT(t.transaction_date, '%Y-%m') = b.month_year), 0) AS spent_amount, " +
                     "b.created_at " +
                     "FROM budgets b " +
                     "JOIN categories c ON b.category_id = c.id " +
                     "WHERE b.id = ? AND b.user_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, budgetRowMapper, id, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Budget save(Budget budget) {
        String sql = "INSERT INTO budgets (user_id, category_id, month_year, amount_limit) VALUES (?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE amount_limit = VALUES(amount_limit)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, budget.getUserId());
            ps.setLong(2, budget.getCategoryId());
            ps.setString(3, budget.getMonthYear());
            ps.setBigDecimal(4, budget.getAmountLimit());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            budget.setId(keyHolder.getKey().longValue());
        }
        return budget;
    }

    public boolean update(Budget budget) {
        String sql = "UPDATE budgets SET category_id = ?, month_year = ?, amount_limit = ? " +
                     "WHERE id = ? AND user_id = ?";
        int rows = jdbcTemplate.update(
            sql,
            budget.getCategoryId(),
            budget.getMonthYear(),
            budget.getAmountLimit(),
            budget.getId(),
            budget.getUserId()
        );
        return rows > 0;
    }

    public boolean deleteByIdAndUserId(Long id, Long userId) {
        String sql = "DELETE FROM budgets WHERE id = ? AND user_id = ?";
        return jdbcTemplate.update(sql, id, userId) > 0;
    }
}
