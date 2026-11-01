package com.arthik.repository;

import com.arthik.model.SavingsContribution;
import com.arthik.model.SavingsGoal;
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
import java.util.List;
import java.util.Optional;

@Repository
public class SavingsRepository {

    private final JdbcTemplate jdbcTemplate;

    public SavingsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SavingsGoal> goalRowMapper = (rs, rowNum) -> {
        SavingsGoal goal = new SavingsGoal();
        goal.setId(rs.getLong("id"));
        goal.setUserId(rs.getLong("user_id"));
        goal.setTitle(rs.getString("title"));
        goal.setTargetAmount(rs.getBigDecimal("target_amount"));
        goal.setCurrentAmount(rs.getBigDecimal("current_amount"));
        goal.setTargetDate(rs.getDate("target_date").toLocalDate());
        goal.setCategory(rs.getString("category"));
        goal.setStatus(rs.getString("status"));
        goal.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        return goal;
    };

    private final RowMapper<SavingsContribution> contributionRowMapper = (rs, rowNum) -> {
        SavingsContribution sc = new SavingsContribution();
        sc.setId(rs.getLong("id"));
        sc.setGoalId(rs.getLong("goal_id"));
        sc.setAmount(rs.getBigDecimal("amount"));
        sc.setContributionDate(rs.getDate("contribution_date").toLocalDate());
        sc.setNotes(rs.getString("notes"));
        sc.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        return sc;
    };

    public List<SavingsGoal> findAllGoalsByUserId(Long userId) {
        String sql = "SELECT id, user_id, title, target_amount, current_amount, target_date, category, status, created_at " +
                     "FROM savings_goals WHERE user_id = ? ORDER BY status ASC, target_date ASC";
        return jdbcTemplate.query(sql, goalRowMapper, userId);
    }

    public Optional<SavingsGoal> findGoalByIdAndUserId(Long id, Long userId) {
        String sql = "SELECT id, user_id, title, target_amount, current_amount, target_date, category, status, created_at " +
                     "FROM savings_goals WHERE id = ? AND user_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, goalRowMapper, id, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public SavingsGoal saveGoal(SavingsGoal goal) {
        String sql = "INSERT INTO savings_goals (user_id, title, target_amount, current_amount, target_date, category, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, goal.getUserId());
            ps.setString(2, goal.getTitle());
            ps.setBigDecimal(3, goal.getTargetAmount());
            ps.setBigDecimal(4, goal.getCurrentAmount() != null ? goal.getCurrentAmount() : BigDecimal.ZERO);
            ps.setDate(5, Date.valueOf(goal.getTargetDate()));
            ps.setString(6, goal.getCategory() != null ? goal.getCategory() : "General");
            ps.setString(7, goal.getStatus() != null ? goal.getStatus() : "IN_PROGRESS");
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            goal.setId(keyHolder.getKey().longValue());
        }
        return goal;
    }

    public void updateGoalProgress(Long goalId, BigDecimal addedAmount) {
        String sql = "UPDATE savings_goals " +
                     "SET current_amount = current_amount + ?, " +
                     "status = CASE WHEN (current_amount + ?) >= target_amount THEN 'COMPLETED' ELSE 'IN_PROGRESS' END " +
                     "WHERE id = ?";
        jdbcTemplate.update(sql, addedAmount, addedAmount, goalId);
    }

    public SavingsContribution saveContribution(SavingsContribution contribution) {
        String sql = "INSERT INTO savings_contributions (goal_id, amount, contribution_date, notes) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, contribution.getGoalId());
            ps.setBigDecimal(2, contribution.getAmount());
            ps.setDate(3, Date.valueOf(contribution.getContributionDate()));
            ps.setString(4, contribution.getNotes());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            contribution.setId(keyHolder.getKey().longValue());
        }
        return contribution;
    }

    public List<SavingsContribution> findContributionsByGoalId(Long goalId) {
        String sql = "SELECT id, goal_id, amount, contribution_date, notes, created_at " +
                     "FROM savings_contributions WHERE goal_id = ? ORDER BY contribution_date DESC, id DESC";
        return jdbcTemplate.query(sql, contributionRowMapper, goalId);
    }
}
