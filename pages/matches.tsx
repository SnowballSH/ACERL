import {NextPage} from "next";
import {getMatches, Match} from "../helpers/firebase";
import {AppShell, Container, Header, Navbar, Table, Text} from "@mantine/core";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import {NextLink} from "@mantine/next";
import {NotificationsProvider} from "@mantine/notifications";
import {Link} from "../helpers/components";

interface Props {
    matches: Match[],
}

export async function getServerSideProps() {
    return {
        props: {
            matches: await getMatches(),
        },
    };
}

const Matches: NextPage<Props> = (props: Props) => {
    const rows = props.matches.sort((a, b) => b.date > a.date ? 1 : -1).map(
        (match) => {
            let date = new Date(match.date * 1000);
            return <tr key={date.toDateString()}>
                <td>
                    {date.toDateString()}
                </td>
                <td>
                    {match.engine1.name} ({match.engine1.rating})
                </td>
                <td>
                    {match.engine2.name} ({match.engine2.rating})
                </td>
                <td>
                    {match.wins}
                </td>
                <td>
                    {match.draws}
                </td>
                <td>
                    {match.losses}
                </td>
                <td>
                    {match.total}
                </td>
                <td>
                    {match.diff > 0 ? "+" : ""}{match.diff}
                </td>
            </tr>;
        }
    );

    return <NotificationsProvider>
        <div className={styles.container}>
            <Head>
                <title>Amateur Chess Engine Rating List - Matches</title>
                <meta name="description" content="Matches for growing, amateur chess engines"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <AppShell
                    padding="md"

                    navbar={<Navbar width={{base: 200}} height={500} p="xs">
                        <NextLink href={"/"}>
                            <Link name={"Rating List"}/>
                        </NextLink>

                        <NextLink href={"/matches"}>
                            <Link name={"Matches"}/>
                        </NextLink>
                    </Navbar>}
                    header={<Header height={80} p={"lg"}>
                        <Text size={"lg"}>
                            Amateur Chess Engine Rating List Matches
                        </Text>
                    </Header>}
                    styles={(theme) => ({
                        main: {backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]},
                    })}
                >
                    <Container style={{minHeight: "100vh"}}>
                        <Table verticalSpacing={"lg"} fontSize={"lg"}>
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Engine 1</th>
                                <th>Engine 2</th>
                                <th>Wins</th>
                                <th>Draws</th>
                                <th>Losses</th>
                                <th>Total</th>
                                <th>ELO Difference</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows}
                            </tbody>
                        </Table>
                    </Container>
                </AppShell>
            </main>
        </div>
    </NotificationsProvider>;
};

export default Matches;