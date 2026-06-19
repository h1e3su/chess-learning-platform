package com.chess.course.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "lessons", indexes = {@Index(name = "idx_lesson_course", columnList = "course_id")})
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, name = "course_id")
    private UUID courseId; // Tham chiếu đến khóa học, không dùng FK trực tiếp tới entity Course để lỏng lẻo hóa (tuỳ chọn), nhưng ở đây cùng một service nên dùng FK cũng được. Sẽ để tham chiếu UUID theo kiến trúc.

    @Column(nullable = false)
    private String title;

    private String videoUrl;

    @Column(nullable = false)
    private Integer orderIndex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LessonType type;

    public Lesson() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public LessonType getType() { return type; }
    public void setType(LessonType type) { this.type = type; }
}
