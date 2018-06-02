/*
Navicat MySQL Data Transfer

Source Server         : justyeh
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : justyeh

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-07-11 14:27:55
*/


DROP DATABASE `justyeh.com`;

CREATE DATABASE IF NOT EXISTS `justyeh.com` DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

USE `justyeh.com`;


-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '姓名',
  `password` varchar(100) DEFAULT NULL COMMENT '密码',
  `image` varchar(100) DEFAULT NULL COMMENT '头像',
  `email` varchar(20) DEFAULT NULL COMMENT '邮箱',
  `bio` varchar(255) DEFAULT NULL COMMENT '自我描述',
  `website` varchar(50) DEFAULT NULL COMMENT '网址',
  `location` varchar(100) DEFAULT NULL COMMENT '地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (null, '叶文祥', '99926e3dab995487ceab34ec1c8b2fd7f99392da', null, 'justyeh@163.com', '码畜，其他没什么好说的！', 'http://www.justyeh.com', '暂住北京');


-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(2050) DEFAULT NULL COMMENT '名称',
  `description` varchar(20) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', 'Administrator', '管理员');
INSERT INTO `role` VALUES ('2', 'Editor', '编辑');
INSERT INTO `role` VALUES ('3', 'Author', '作者');
INSERT INTO `role` VALUES ('4', 'Owner', '博客所有者');


-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `role_id` int(8) NOT NULL COMMENT '角色ID',
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户角色表';

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES (null, '1', '1');


-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL COMMENT '标题',
  `poster` varchar(100) DEFAULT NULL COMMENT '海报图片',
  `summary` text DEFAULT NULL COMMENT '摘要',
  `markdown` text DEFAULT NULL COMMENT 'markdown文件',
  `status` varchar(20) DEFAULT 'draft' COMMENT '状态（draft草稿，published已发布，offline下线）',
  `updated_at` bigint(20) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='文章表';


-- ----------------------------
-- Table structure for post_tag
-- ----------------------------
DROP TABLE IF EXISTS `post_tag`;
CREATE TABLE `post_tag` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `post_id` int(8) NOT NULL COMMENT '角色ID',
  `tag_id` int(8) NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='文章标签表';


-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '名称',
  `hidden` tinyint(1) DEFAULT '0' COMMENT '是否隐藏（0显示，1隐藏）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='标签表';

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `post_id` int(8) NOT NULL COMMENT '文章id',
  `name` varchar(50) DEFAULT NULL COMMENT '姓名',
  `content` varchar(100) DEFAULT NULL COMMENT '访问地址',
  `updated_at` varchar(100) DEFAULT NULL COMMENT '密码',
  `is_read` int(1) DEFAULT 0 COMMENT '是否阅读（0未读，1已读）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='文章评论表';
