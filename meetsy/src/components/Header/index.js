import React, { useContext } from 'react';
import { string } from 'prop-types';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import IconSearch from '../../assets/icon-search.js';
import IconBell from '../../assets/icon-notifications.js';
import DropdownComponent from '../Dropdown/index.js';
import { useHistory } from "react-router-dom";
import { ACCOUNT } from '../../constants/routes';
import './header.css';
const useStyles = createUseStyles((theme) => ({

    container: {
        height: 40
    },
    name: {
        textAlign: 'right',
        '@media (max-width: 768px)': {
            display: 'none'
        }
    },
    title: {
        fontSize: '20px',
        fontFamily: '\'DM Serif Display\', serif',
        '@media (max-width: 1080px)': {
            marginLeft: 50
        },
        '@media (max-width: 468px)': {
            fontSize: 20
        }
    },
    iconStyles: {
        cursor: 'pointer',
        marginLeft: 12,
        marginRight: 12,
        '@media (max-width: 768px)': {
            marginLeft: 12
        }
    },
    separator: {
        borderLeft: `1px solid gray`,
        marginLeft: 32,
        marginRight: 32,
        height: 22,
        width: 2,
        '@media (max-width: 768px)': {
            marginLeft: 14,
            marginRight: 0
        }
    },
    imageCtn : {
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        overflow: 'hidden',
        margin: '0 10px'
      },
      image: {
          height: '100%',
          width: 'auto'
      }
}));

function HeaderComponent() {
    const theme = useTheme();
    let history = useHistory();
    const classes = useStyles({ theme });
    
    function onSettingsClick() 
{
    history.push(ACCOUNT);
}

    return (
        <Row className={classes.container} vertical='center' horizontal='space-between'>
            {/* Afisam titlul paginii */}
            <span></span>
            {/* <span className={classes.title}>Meet<span className = {classes.title} style={{color: '#3e6ae1'}}>Sy</span></span> */}
            <Row vertical='center'>
                {/* ne luam un flexbox pe row aliniat in centru; componenta in sine o sa fie alineata la sfarsitul flexului trecut */}
                <div className={classes.iconStyles}>
                    <IconSearch />
                </div>
                <div className={classes.iconStyles}>
                    <DropdownComponent
                        label={<IconBell />}
                        options={[
                            {
                                label: 'Notification #1',
                                onClick: () => console.log('Notification #1')
                            },
                            {
                                label: 'Notification #2',
                                onClick: () => console.log('Notification #2')
                            },
                            {
                                label: 'Notification #3',
                                onClick: () => console.log('Notification #3')
                            },
                            {
                                label: 'Notification #4',
                                onClick: () => console.log('Notification #4')
                            }
                        ]}
                        position={{
                            top: 42,
                            right: -14
                        }}
                    />
                </div>
                <div className={classes.separator}></div>
                <DropdownComponent
                    label={
                        <>
                            <span className={classes.name}>Taylor Hill</span>
                            <div className = {classes.imageCtn}>
                            <img
                                src='https://hips.hearstapps.com/harpersbazaaruk.cdnds.net/17/03/1484755929-taylor-hill.jpg'
                                alt='avatar'
                                className={classes.image}
                            />
                            </div>
                        </>
                    }
                    options={[
                        {
                            label: 'Settings',
                            onClick: onSettingsClick
                        },
                        {
                            label: 'Logout',
                            onClick: () => console.log('logout')
                        }
                    ]}
                    position={{
                        top: 52,
                        right: -6
                    }}
                />
            </Row>
        </Row>
    );
}


HeaderComponent.propTypes = {
    title: string
};

export default HeaderComponent;