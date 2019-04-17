/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : justyeh_temp

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2019-01-05 14:51:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `post_id` int(8) NOT NULL COMMENT '文章id',
  `name` varchar(50) DEFAULT NULL COMMENT '姓名',
  `contacts` varchar(50) DEFAULT NULL COMMENT '联系方式',
  `content` varchar(1000) DEFAULT NULL COMMENT '访问地址',
  `updated_at` varchar(100) DEFAULT NULL COMMENT '密码',
  `is_read` int(1) DEFAULT '0' COMMENT '是否阅读（0未读，1已读）',
  `is_show` int(1) DEFAULT '1' COMMENT '是否显示（0影藏，1显示）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COMMENT='文章评论表';

-- ----------------------------
-- Records of comment
-- ----------------------------
