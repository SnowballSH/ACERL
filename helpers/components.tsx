import {useHover} from "@mantine/hooks";
import {Text} from "@mantine/core";

export const Link = (props: { name: string }) => {
    const {hovered, ref} = useHover();
    return <Text ref={ref} size={"lg"} style={{
        padding: "10px",
        backgroundColor: hovered ? "whitesmoke" : "white",
    }}>
        {props.name}
    </Text>;
};