import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "../Home";
import App from "../app/App";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import PropTypes from "prop-types";
import { IntlProvider, addLocaleData } from "react-intl";
import { AppContainer } from "react-hot-loader";
import { LocaleProvider } from "antd";
import { connect } from "react-redux";

class WebApp extends Component {
    constructor(props) {
        super(props);
        let lang = props.language || "en";
        this.state = {
            appLocale: this.getLocale(lang),
        };
    }

    getLocale(lang) {
        return window.appLocale[lang] || window.appLocale["en"] || window.appLocale["zh"];
    }

    componentWillReceiveProps(newProps) {
        if (this.props.language !== newProps.language) {
            this.setState({ appLocale: this.getLocale(newProps.language) });
            // this.state.appLocale = this.getLocale(newProps.language)
        }
    }

    render() {
        addLocaleData(this.state.appLocale.data);
        return (
            <LocaleProvider locale={this.state.appLocale.antd}>
                <IntlProvider locale={this.state.appLocale.locale} messages={this.state.appLocale.messages}>
                    <AppContainer>
                        <Router>
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route path="/app" component={App} />
                                <Route exact path="/login" component={Login} />
                                <Route exact path="/logout" component={Logout} />
                            </Switch>
                        </Router>
                    </AppContainer>
                </IntlProvider>
            </LocaleProvider>
        );
    }
}

WebApp.propTypes = {
    language: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        language: state.language,
    };
};

export default connect(mapStateToProps)(WebApp);

/*
export default () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/app" component={App} />
            <Route exact path="/login" component={Login} />
        </Switch>
    </Router>
)*/
