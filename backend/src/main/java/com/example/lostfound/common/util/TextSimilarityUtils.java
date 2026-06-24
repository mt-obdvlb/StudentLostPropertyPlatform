package com.example.lostfound.common.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;

public final class TextSimilarityUtils {

    private TextSimilarityUtils() {
    }

    public static double weightedPostSimilarity(
        String titleA,
        String descriptionA,
        String locationA,
        String titleB,
        String descriptionB,
        String locationB
    ) {
        double titleSimilarity = jaccard(titleA, titleB);
        double descriptionSimilarity = jaccard(descriptionA, descriptionB);
        double locationMatch = normalize(locationA).equals(normalize(locationB)) ? 1.0 : 0.0;
        return round(titleSimilarity * 0.5 + descriptionSimilarity * 0.3 + locationMatch * 0.2);
    }

    public static double jaccard(String left, String right) {
        Set<String> leftTokens = tokenize(left);
        Set<String> rightTokens = tokenize(right);
        if (leftTokens.isEmpty() && rightTokens.isEmpty()) {
            return 1.0;
        }
        if (leftTokens.isEmpty() || rightTokens.isEmpty()) {
            return 0.0;
        }
        Set<String> intersection = new LinkedHashSet<>(leftTokens);
        intersection.retainAll(rightTokens);
        Set<String> union = new LinkedHashSet<>(leftTokens);
        union.addAll(rightTokens);
        double unionScore = (double) intersection.size() / union.size();
        double containmentScore = (double) intersection.size() / Math.min(leftTokens.size(), rightTokens.size());
        return round(Math.max(unionScore, containmentScore));
    }

    public static String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toLowerCase(Locale.ROOT).replaceAll("[\\p{Punct}\\s]+", "");
    }

    private static Set<String> tokenize(String value) {
        String normalized = normalize(value);
        Set<String> tokens = new LinkedHashSet<>();
        for (int i = 0; i < normalized.length(); i++) {
            int codePoint = normalized.codePointAt(i);
            if (Character.charCount(codePoint) == 2) {
                i++;
            }
            tokens.add(new String(Character.toChars(codePoint)));
        }
        return tokens;
    }

    private static double round(double value) {
        return BigDecimal.valueOf(value).setScale(4, RoundingMode.HALF_UP).doubleValue();
    }
}
