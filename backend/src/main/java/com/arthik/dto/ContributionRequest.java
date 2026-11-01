package com.arthik.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ContributionRequest {
    @NotNull(message = "Contribution amount is required")
    @DecimalMin(value = "0.01", message = "Contribution must be greater than zero")
    private BigDecimal amount;

    private LocalDate contributionDate;
    private String notes;

    public ContributionRequest() {}

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getContributionDate() {
        return contributionDate != null ? contributionDate : LocalDate.now();
    }
    public void setContributionDate(LocalDate contributionDate) { this.contributionDate = contributionDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
