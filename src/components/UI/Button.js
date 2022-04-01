const Button = (props) => {
    const {text, ...rest} = props;

    return <button {...rest}>{text}</button>
}

export default Button;
