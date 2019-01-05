/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : justyeh_temp

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2019-01-05 11:51:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COMMENT='叶文祥的前端博客：标签表';

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES ('3', 'Ghost博客的搭建');
INSERT INTO `tag` VALUES ('4', 'html');
INSERT INTO `tag` VALUES ('5', 'meta标签');
INSERT INTO `tag` VALUES ('6', '正则');
INSERT INTO `tag` VALUES ('7', '微信小程序');
INSERT INTO `tag` VALUES ('8', 'git');
INSERT INTO `tag` VALUES ('9', 'flex');
INSERT INTO `tag` VALUES ('10', 'webuploader');
INSERT INTO `tag` VALUES ('11', '插件');
INSERT INTO `tag` VALUES ('12', '滚动条美化');
INSERT INTO `tag` VALUES ('13', 'justyeh');
INSERT INTO `tag` VALUES ('14', '导航');
INSERT INTO `tag` VALUES ('15', 'markdown');
INSERT INTO `tag` VALUES ('16', '无缝滚动');
INSERT INTO `tag` VALUES ('17', 'web编辑器');
INSERT INTO `tag` VALUES ('18', 'wangEditor');
INSERT INTO `tag` VALUES ('19', 'framework');
INSERT INTO `tag` VALUES ('20', 'isux');
INSERT INTO `tag` VALUES ('21', '代码高亮');
INSERT INTO `tag` VALUES ('22', 'requirejs');
INSERT INTO `tag` VALUES ('23', '模块化');
INSERT INTO `tag` VALUES ('24', 'sublime');
INSERT INTO `tag` VALUES ('25', 'css');
INSERT INTO `tag` VALUES ('26', 'js123');
INSERT INTO `tag` VALUES ('27', 'scroll');
INSERT INTO `tag` VALUES ('28', 'IDE');
INSERT INTO `tag` VALUES ('29', 'Vue');
INSERT INTO `tag` VALUES ('30', 'Nuxt.js');
INSERT INTO `tag` VALUES ('31', 'Node.js');
INSERT INTO `tag` VALUES ('32', 'Vue.js');
INSERT INTO `tag` VALUES ('33', '异步');
INSERT INTO `tag` VALUES ('34', '1px');
INSERT INTO `tag` VALUES ('35', '1px');
INSERT INTO `tag` VALUES ('36', 'video');
INSERT INTO `tag` VALUES ('37', '爬虫');
INSERT INTO `tag` VALUES ('38', 'yy');
INSERT INTO `tag` VALUES ('39', 'hh');
INSERT INTO `tag` VALUES ('40', 'tets');
INSERT INTO `tag` VALUES ('41', 'newtag');
