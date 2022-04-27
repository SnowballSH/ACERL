import type {NextPage} from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import {AppShell, Navbar, Header, Container, Text, Table, Input, Button} from '@mantine/core';
import {NotificationsProvider, showNotification} from '@mantine/notifications';

import {auth, db, Engine, getEngines} from '../helpers/firebase';
import {NextLink} from "@mantine/next";
import {RefObject, useRef, useState} from "react";
import {onAuthStateChanged, signInWithEmailAndPassword, signOut} from "@firebase/auth";
import {addDoc, collection} from "@firebase/firestore";
import {Link} from "../helpers/components";

interface Props {
    engines: Engine[],
}

export async function getServerSideProps() {
    return {
        props: {
            engines: await getEngines(),
        },
    };
}

const Home: NextPage<Props> = (props: Props) => {
    const rows = props.engines.sort((a, b) => b.rating - a.rating).map(
        (engine) =>
            <tr key={engine.name}>
                <td>
                    {engine.name}
                </td>
                <td>
                    {engine.rating}
                </td>
                <td>
                    {engine.stable ? "Yes" : "No"}
                </td>
                <td>
                    {engine.games}
                </td>
                <td>
                    {engine.author}
                </td>
            </tr>
    );

    const email = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
    const pwd = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;

    const newEngineName = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
    const newEngineRating = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
    const newEngineAuthor = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;

    const [signIn, setSignIn] = useState(false);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setSignIn(true);
        } else {
            setSignIn(false);
        }
    });

    return (
        <NotificationsProvider>
            <div className={styles.container}>
                <Head>
                    <title>Amateur Chess Engine Rating List</title>
                    <meta name="description" content="Rating List for growing, amateur chess engines"/>
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
                                Amateur Chess Engine Rating List
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
                                    <th>Engine</th>
                                    <th>Rating</th>
                                    <th>Stable?</th>
                                    <th>Games Played</th>
                                    <th>Author</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows}
                                </tbody>
                            </Table>
                        </Container>
                    </AppShell>

                    <br/>
                    <br/>

                    {
                        signIn ? (
                            <Container>
                                <Text size={"lg"}>Admin Page</Text>

                                <br/>

                                <Input ref={newEngineName} placeholder={"New Engine Name"}/>

                                <br/>

                                <Input ref={newEngineRating} placeholder={"New Engine Rating"}/>

                                <br/>

                                <Input ref={newEngineAuthor} placeholder={"New Engine Author"}/>

                                <br/>

                                <Button onClick={() => {
                                    const name = newEngineName.current!.value;
                                    const rating = newEngineRating.current!.value;
                                    const author = newEngineAuthor.current!.value;

                                    addDoc(collection(db, "engines"), {
                                        name,
                                        rating: parseFloat(rating),
                                        games: 0,
                                        stable: false,
                                        author,
                                    }).then(_ => {
                                        showNotification({
                                            color: 'blue',
                                            title: "Success",
                                            message: `Created new engine ${name}`,
                                        });
                                    }).catch(e => {
                                        showNotification({
                                            color: 'red',
                                            title: "Error",
                                            message: `Failed to create new engine ${name}: ${JSON.stringify(e)}`,
                                        });
                                    });
                                }}>
                                    Create New Engine
                                </Button>

                                <br/>
                                <br/>

                                <Button onClick={
                                    () => {
                                        signOut(auth).then(_ => {
                                            showNotification({
                                                color: 'yellow',
                                                title: "Success",
                                                message: `Logged Out`
                                            });
                                        });
                                    }
                                }>Log Out</Button>
                            </Container>
                        ) : null
                    }

                    <br/>
                    <br/>

                    <Container>
                        <Text size={"lg"}>Admin Login</Text>

                        <br/>

                        <Input ref={email} placeholder={"Email"}/>

                        <br/>

                        <Input ref={pwd} placeholder={"Password"}/>

                        <br/>

                        <Button onClick={() => {
                            const emailValue = email.current!.value;
                            const pwdValue = pwd.current!.value;

                            if (!emailValue.includes("@") || !emailValue.includes(".")) {
                                showNotification({
                                    color: 'red',
                                    title: "Failure",
                                    message: "Email must contain @ and ."
                                });
                                return;
                            }

                            if (pwdValue.length <= 4) {
                                showNotification({
                                    color: 'red',
                                    title: "Failure",
                                    message: "Password too short"
                                });
                                return;
                            }

                            signInWithEmailAndPassword(auth, emailValue, pwdValue).then(r => {
                                showNotification({
                                    color: 'green',
                                    title: "Success",
                                    message: `Loggged in as Admin. uid: ${r.user.uid}`
                                });
                            }).catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                showNotification({
                                    color: 'red',
                                    title: "Failure",
                                    message: `${errorCode}: ${errorMessage}`
                                });
                            });
                        }}>Login</Button>
                    </Container>
                </main>
            </div>
        </NotificationsProvider>
    );
};

export default Home;
