const ComponentParentRenderer = ({
    render,
    ...props
}) => render({ ...props });

export default ComponentParentRenderer;