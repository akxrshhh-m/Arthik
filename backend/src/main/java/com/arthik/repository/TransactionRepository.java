package com.arthik.repository;

import com.arthik.dto.CategorySpendingDto;
import com.arthik.dto.MonthlySummaryDto;
import com.arthik.model.ExpenseTransaction;
import com.arthik.model.IncomeTransaction;
import com.arthik.model.Transaction;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * DBMS Integration - Parameterized Spring JDBC Template.
 * Demonstrates Polymorphism in row mapping: Instantiates IncomeTransaction or ExpenseTransaction.
 */
@Repository
public class TransactionRepository {

    private final JdbcTemplate jdbcTemplate;

    public TransactionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Transaction> transactionRowMapper = (rs, rowNum) -> {
        String type = rs.getString("type");
        Transaction tx = "INCOME".equalsIgnoreCase(type) ? new IncomeTransaction() : new ExpenseTransaction();
        tx.setId(rs.getLong("id"));
        tx.setUserId(rs.getLong("user_id"));
        tx.setCategoryId(rs.getLong("category_id"));
        tx.setCategoryName(rs.getString("category_name"));
        tx.setCategoryColor(rs.getString("category_color"));
        tx.setCategoryIcon(rs.getString("category_icon"));
        tx.setTitle(rs.getString("title"));
        tx.setAmount(rs.getBigDecimal("amount"));
        tx.setType(type);
        tx.setTransactionDate(rs.getDate("transaction_date").toLocalDate());
        tx.setPaymentMethod(rs.getString("payment_method"));
        tx.setDescription(rs.getString("description"));
        tx.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        return tx;
    };

    public List<Transaction> findAll(Long userId, Long categoryId, LocalDate startDate, LocalDate endDate, String search) {
        StringBuilder sql = new StringBuilder(
            "SELECT t.id, t.user_id, t.category_id, c.name AS category_name, c.color AS category_color, " +
            "c.icon AS category_icon, t.title, t.amount, t.type, t.transaction_date, t.payment_method, " +
            "t.description, t.created_at " +
            "FROM transactions t " +
            "JOIN categories c ON t.category_id = c.id " +
            "WHERE t.user_id = ? "
        );
        List<Object> params = new ArrayList<>();
        params.add(userId);

        if (categoryId != null) {
            sql.append("AND t.category_id = ? ");
            params.add(categoryId);
        }
        if (startDate != null) {
            sql.append("AND t.transaction_date >= ? ");
            params.add(Date.valueOf(startDate));
        }
        if (endDate != null) {
            sql.append("AND t.transaction_date <= ? ");
            params.add(Date.valueOf(endDate));
        }
        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(t.title) LIKE ? OR LOWER(t.description) LIKE ? OR LOWER(t.payment_method) LIKE ?) ");
            String wild = "%" + search.trim().toLowerCase() + "%";
            params.add(wild);
            params.add(wild);
            params.add(wild);
        }

        sql.append("ORDER BY t.transaction_date DESC, t.id DESC");
        return jdbcTemplate.query(sql.toString(), transactionRowMapper, params.toArray());
    }

    public Optional<Transaction> findByIdAndUserId(Long id, Long userId) {
        String sql = "SELECT t.id, t.user_id, t.category_id, c.name AS category_name, c.color AS category_color, " +
                     "c.icon AS category_icon, t.title, t.amount, t.type, t.transaction_date, t.payment_method, " +
                     "t.description, t.created_at " +
                     "FROM transactions t " +
                     "JOIN categories c ON t.category_id = c.id " +
                     "WHERE t.id = ? AND t.user_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, transactionRowMapper, id, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Transaction save(Transaction tx) {
        String sql = "INSERT INTO transactions (user_id, category_id, title, amount, type, transaction_date, payment_method, description) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, tx.getUserId());
            ps.setLong(2, tx.getCategoryId());
            ps.setString(3, tx.getTitle());
            ps.setBigDecimal(4, tx.getAmount());
            ps.setString(5, tx.getType());
            ps.setDate(6, Date.valueOf(tx.getTransactionDate()));
            ps.setString(7, tx.getPaymentMethod());
            ps.setString(8, tx.getDescription());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            tx.setId(keyHolder.getKey().longValue());
        }
        return tx;
    }

    public boolean update(Transaction tx) {
        String sql = "UPDATE transactions SET category_id = ?, title = ?, amount = ?, type = ?, " +
                     "transaction_date = ?, payment_method = ?, description = ? WHERE id = ? AND user_id = ?";
        int rows = jdbcTemplate.update(
            sql,
            tx.getCategoryId(),
            tx.getTitle(),
            tx.getAmount(),
            tx.getType(),
            Date.valueOf(tx.getTransactionDate()),
            tx.getPaymentMethod(),
            tx.getDescription(),
            tx.getId(),
            tx.getUserId()
        );
        return rows > 0;
    }

    public boolean deleteByIdAndUserId(Long id, Long userId) {
        String sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
        return jdbcTemplate.update(sql, id, userId) > 0;
    }

    public BigDecimal getTotalIncomeForMonth(Long userId, String monthYear) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM transactions " +
                     "WHERE user_id = ? AND type = 'INCOME' AND DATE_FORMAT(transaction_date, '%Y-%m') = ?";
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, userId, monthYear);
    }

    public BigDecimal getTotalExpenseForMonth(Long userId, String monthYear) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM transactions " +
                     "WHERE user_id = ? AND type = 'EXPENSE' AND DATE_FORMAT(transaction_date, '%Y-%m') = ?";
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, userId, monthYear);
    }

    public BigDecimal getLifetimeBalance(Long userId) {
        String sql = "SELECT " +
                     "COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END), 0) " +
                     "FROM transactions WHERE user_id = ?";
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, userId);
    }

    public List<CategorySpendingDto> getCategorySpending(Long userId, String monthYear) {
        String sql = "SELECT c.name AS category_name, c.color, c.icon, SUM(t.amount) AS total_amount " +
                     "FROM transactions t " +
                     "JOIN categories c ON t.category_id = c.id " +
                     "WHERE t.user_id = ? AND t.type = 'EXPENSE' AND DATE_FORMAT(t.transaction_date, '%Y-%m') = ? " +
                     "GROUP BY c.id, c.name, c.color, c.icon " +
                     "ORDER BY total_amount DESC";

        BigDecimal totalMonthExpense = getTotalExpenseForMonth(userId, monthYear);
        double totalExpenseVal = totalMonthExpense != null ? totalMonthExpense.doubleValue() : 0.0;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            CategorySpendingDto dto = new CategorySpendingDto();
            dto.setCategoryName(rs.getString("category_name"));
            dto.setColor(rs.getString("color"));
            dto.setIcon(rs.getString("icon"));
            BigDecimal amt = rs.getBigDecimal("total_amount");
            dto.setAmount(amt);
            if (totalExpenseVal > 0) {
                dto.setPercentage(Math.round((amt.doubleValue() / totalExpenseVal * 100.0) * 10.0) / 10.0);
            } else {
                dto.setPercentage(0.0);
            }
            return dto;
        }, userId, monthYear);
    }

    public List<MonthlySummaryDto> getMonthlySummary(Long userId) {
        String sql = "SELECT DATE_FORMAT(transaction_date, '%Y-%m') AS m_year, " +
                     "COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS total_income, " +
                     "COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expense " +
                     "FROM transactions " +
                     "WHERE user_id = ? " +
                     "GROUP BY m_year " +
                     "ORDER BY m_year ASC LIMIT 12";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            MonthlySummaryDto dto = new MonthlySummaryDto();
            dto.setMonth(rs.getString("m_year"));
            BigDecimal inc = rs.getBigDecimal("total_income");
            BigDecimal exp = rs.getBigDecimal("total_expense");
            dto.setIncome(inc);
            dto.setExpense(exp);
            dto.setSavings(inc.subtract(exp));
            return dto;
        }, userId);
    }

    public BigDecimal getHighestIndividualExpense(Long userId) {
        String sql = "SELECT COALESCE(MAX(amount), 0) FROM transactions WHERE user_id = ? AND type = 'EXPENSE'";
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, userId);
    }

    public BigDecimal getAverageDailySpending(Long userId, String monthYear) {
        String sql = "SELECT COALESCE(SUM(amount) / COUNT(DISTINCT transaction_date), 0) FROM transactions " +
                     "WHERE user_id = ? AND type = 'EXPENSE' AND DATE_FORMAT(transaction_date, '%Y-%m') = ?";
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, userId, monthYear);
    }
}
