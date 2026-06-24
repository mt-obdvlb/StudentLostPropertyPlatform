package com.example.lostfound.common.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TextSimilarityUtilsTest {

    @Test
    void jaccardReturnsOneForEquivalentTextAfterNormalization() {
        double score = TextSimilarityUtils.jaccard("黑色 长柄 雨伞", "黑色长柄雨伞");

        assertThat(score).isEqualTo(1.0);
    }

    @Test
    void weightedSimilarityGivesHighScoreForSameLocationAndSimilarContent() {
        double score = TextSimilarityUtils.weightedPostSimilarity(
            "图书馆捡到黑色雨伞",
            "在图书馆二楼捡到一把黑色长柄雨伞",
            "图书馆二楼",
            "捡到黑色长柄雨伞",
            "图书馆二楼发现黑色雨伞",
            "图书馆二楼"
        );

        assertThat(score).isGreaterThanOrEqualTo(0.75);
    }
}
