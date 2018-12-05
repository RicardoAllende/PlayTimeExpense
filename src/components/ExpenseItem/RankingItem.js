import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import { View, Grid, Col, Text, Icon, Item, Thumbnail } from "native-base";

import { formatAmount } from "@utils/formatters";
import styles from "./styles";

const defaultAvatar = require("@assets/images/default_avatar.png");

const RankingItem = ({ item, style, color, _onPress }) => {
    const borderColor = color ? color : item.color;

    _onPressButton = courseId => {
        alert("Ranking item " + courseId);
        this.props.navigation.navigate("Quizz", {
            courseId: courseId
        });
    };

    // avatar = <Thumbnail circle={false} source={ defaultAvatar } style={{ borderRadius: 8, width: 40, height: 40 }} />
    // console.log(item.avatar)
    if (item.avatar == null) {
        avatar = <Thumbnail circle={false} source={ defaultAvatar } style={{ borderRadius: 8, width: 40, height: 40 }} />
    } else {
        avatar = <Thumbnail circle={false} source={{
            uri: item.avatar,
            cache: 'only-if-cached',
        }} style={{ borderRadius: 8, width: 40, height: 40,}} />
    }

    return (
        <View style={[styles.item.content, { borderColor: borderColor }, style]}>
            <TouchableOpacity onPress={() => console.log("")}>
                <Grid>
                    <Col size={7} style={{ flexDirection: "row" }}>
                        {avatar}
                        {/* <Icon name="person" style={styles.item.icon} /> */}
                        <View>
                            <Text numberOfLines={2} style={styles.item.title}>
                                {item.rank + " " + item.firstname + " " + item.lastname}
                            </Text>
                        </View>
                    </Col>
                    <Col size={3}>
                        <Text numberOfLines={2} style={styles.item.incomeAmount}>
                            {/* .expenseAmount || .incomeAmount */}
                            {item.hits}
                        </Text>
                    </Col>
                </Grid>
            </TouchableOpacity>
        </View>
    );
};

// ExpenseItem.propTypes = {
//   item: PropTypes.object.isRequired,
//   style: PropTypes.object,
//   color: PropTypes.string,
// };

export default RankingItem;
