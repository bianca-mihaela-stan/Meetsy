import React from 'react';
import { bool, func, string } from 'prop-types';
import { Link } from 'react-router-dom';
import { Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    activeBar: {
        height: 56,
        width: 3,
        backgroundColor: '#DDE2FF',
        position: 'absolute',
        left: 0
    },
    activeTitle: {
        color: '#DDE2FF'
    },
    container: {
        cursor: 'pointer',
        flexDirection: 'column',
        paddingTop: '12%',
        paddingBottom: '12%'
    },
    title: {
        fontSize: 16,
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#A4A6B3',
        textDecoration: 'none'
    },
    iconCtn : {
      borderRadius: '50%',
      padding: '8px',
      ':hover': {
        backgroundColor: '#01abf4'
    },
    }
});

function MenuItemComponent(props){
    const {path, icon,title,...otherProps} = props;
    const Icon = icon;
    const Path = path;
    return (
        <Row className={css(styles.container)} vertical="center">
        <Link to={Path} className={css(styles.title, styles.iconCtn)}><Icon /></Link>
        </Row>
    );
}

MenuItemComponent.propTypes = {
    icon: func,
    title: string
};

export default MenuItemComponent;