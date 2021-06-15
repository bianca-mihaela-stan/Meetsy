import React from 'react';
import { func, string } from 'prop-types';
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
        paddingTop: '18%',
        paddingBottom: '18%',
        ':hover': {
            backgroundColor: '#131516'
        }
    },
    title: {
        fontSize: 16,
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#A4A6B3',
        textDecoration: 'none'
    },
    iconCtn: {
        borderRadius: '50%'
    }
});

function MenuItemComponent(props) {
    const { path, icon, title, ...otherProps } = props;
    const Icon = icon;
    const Path = path;
    return (
        <Link to={Path} className={css(styles.title, styles.iconCtn)}>
            <Row className={css(styles.container)} vertical="center">
                <Icon />
            </Row>
        </Link>
    );
}

MenuItemComponent.propTypes = {
    icon: func,
    title: string
};

export default MenuItemComponent;