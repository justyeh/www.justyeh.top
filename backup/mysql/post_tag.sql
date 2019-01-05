/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : justyeh_temp

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2019-01-05 13:06:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for post_tag
-- ----------------------------
DROP TABLE IF EXISTS `post_tag`;
CREATE TABLE `post_tag` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `post_id` int(8) NOT NULL COMMENT '角色ID',
  `tag_id` int(8) NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8 COMMENT='叶文祥的前端博客：文章标签表';

-- ----------------------------
-- Records of post_tag
-- ----------------------------
INSERT INTO `post_tag` VALUES ('3', '2', '3');
INSERT INTO `post_tag` VALUES ('4', '4', '4');
INSERT INTO `post_tag` VALUES ('5', '4', '5');
INSERT INTO `post_tag` VALUES ('6', '5', '6');
INSERT INTO `post_tag` VALUES ('7', '6', '7');
INSERT INTO `post_tag` VALUES ('8', '7', '8');
INSERT INTO `post_tag` VALUES ('9', '9', '9');
INSERT INTO `post_tag` VALUES ('10', '10', '10');
INSERT INTO `post_tag` VALUES ('11', '11', '11');
INSERT INTO `post_tag` VALUES ('13', '10', '11');
INSERT INTO `post_tag` VALUES ('15', '13', '14');
INSERT INTO `post_tag` VALUES ('16', '14', '15');
INSERT INTO `post_tag` VALUES ('19', '15', '11');
INSERT INTO `post_tag` VALUES ('20', '15', '16');
INSERT INTO `post_tag` VALUES ('21', '17', '15');
INSERT INTO `post_tag` VALUES ('22', '17', '17');
INSERT INTO `post_tag` VALUES ('23', '18', '18');
INSERT INTO `post_tag` VALUES ('24', '18', '17');
INSERT INTO `post_tag` VALUES ('25', '18', '11');
INSERT INTO `post_tag` VALUES ('27', '20', '20');
INSERT INTO `post_tag` VALUES ('28', '21', '17');
INSERT INTO `post_tag` VALUES ('29', '21', '21');
INSERT INTO `post_tag` VALUES ('30', '22', '22');
INSERT INTO `post_tag` VALUES ('31', '22', '23');
INSERT INTO `post_tag` VALUES ('32', '23', '23');
INSERT INTO `post_tag` VALUES ('33', '26', '8');
INSERT INTO `post_tag` VALUES ('35', '28', '25');
INSERT INTO `post_tag` VALUES ('36', '28', '26');
INSERT INTO `post_tag` VALUES ('37', '9', '25');
INSERT INTO `post_tag` VALUES ('38', '11', '27');
INSERT INTO `post_tag` VALUES ('39', '1', '28');
INSERT INTO `post_tag` VALUES ('40', '20', '25');
INSERT INTO `post_tag` VALUES ('41', '19', '13');
INSERT INTO `post_tag` VALUES ('42', '13', '11');
INSERT INTO `post_tag` VALUES ('43', '21', '11');
INSERT INTO `post_tag` VALUES ('44', '19', '4');
INSERT INTO `post_tag` VALUES ('45', '29', '30');
INSERT INTO `post_tag` VALUES ('46', '29', '31');
INSERT INTO `post_tag` VALUES ('47', '29', '32');
INSERT INTO `post_tag` VALUES ('48', '30', '26');
INSERT INTO `post_tag` VALUES ('49', '30', '33');
INSERT INTO `post_tag` VALUES ('50', '31', '25');
INSERT INTO `post_tag` VALUES ('51', '31', '9');
INSERT INTO `post_tag` VALUES ('52', '32', '25');
INSERT INTO `post_tag` VALUES ('53', '32', '34');
INSERT INTO `post_tag` VALUES ('56', '34', '26');
INSERT INTO `post_tag` VALUES ('57', '34', '29');
INSERT INTO `post_tag` VALUES ('58', '35', '36');
INSERT INTO `post_tag` VALUES ('61', '12', '13');
INSERT INTO `post_tag` VALUES ('63', '33', '26');
INSERT INTO `post_tag` VALUES ('70', '39', '41');
