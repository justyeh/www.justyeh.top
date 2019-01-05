/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : justyeh_temp

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2019-01-05 11:49:13
*/

SET FOREIGN_KEY_CHECKS=0;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='叶文祥的前端博客：用户表';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '叶文祥', '99926e3dab995487ceab34ec1c8b2fd7f99392da', null, 'justyeh@163.com', '码畜，其他没什么好说的！', 'http://www.justyeh.com', '暂住北京');
