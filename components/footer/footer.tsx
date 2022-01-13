import type {NextPage} from 'next'
import Content from "./content";
import CopyRight from "./copy-right";

const Footer: NextPage = () => {
    return (
        <>
            <Content/>
            <CopyRight />
        </>
    );
}

export default Footer;
