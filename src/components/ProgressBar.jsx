import React from "react";
import {Progress} from 'antd'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {formatProgress} from '../messages'
class ProgressBar extends React.Component {
    render() {
        let {code, name, data, messagePos, dispatch, intl, className, style, ...otherProps} = this.props;
        let topMessage = (messagePos === 'top');
        return (
            <div className={className} style={style}>
                { data && !topMessage && <Progress {...data} {...otherProps}/>}
                {data && (
                    <div style={{display: "flex"}}><
                        div>{name}</div>
                        {data.message && <div style={{textAlign: "center", flexGrow: 1, overflow: "hidden"}}>{formatProgress(intl, data.message) || this.props.defaultmessage}</div>}
                    </div>
                )}
                { data && topMessage && <Progress {...data} {...otherProps}/>}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    let code = props.code;
    let pg = state.progress[code]
    if(pg) {
        return {
            defaultmessage: pg.info.message || '',
            name: pg.info.name,
            data: pg.data
        }
    } else {
        return {
            data: undefined
        }
    }
}

ProgressBar.propTypes = {
    code: PropTypes.string,
    data: PropTypes.object,
    name: PropTypes.string,
    messagePos: PropTypes.oneOf(['top', 'bottom']),
    defaultmessage : PropTypes.string
}

export default connect(mapStateToProps)(injectIntl(ProgressBar))