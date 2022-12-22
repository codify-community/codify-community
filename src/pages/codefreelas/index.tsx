import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";

import { codeFreelasApi } from "../../lib/axios";

import { FormContainer, Form, Content, FreelasContainer, Freelas } from "../../styles/pages/codefreelas/home";

import { Title } from "../../components/Title";
import { FreelaCard } from "../../components/FreelaCard";
import { useState } from "react";

interface HomeProps {
  freelas: ResumeFreela[];
}

export interface ResumeFreela {
  id: number
  title: string
  description: string
  price: number
  deadline: string
  technologies: string[]
  createdAt: Date
  user_id: string
  user_avatar: string
  user_name: string
}

export default function Home({ freelas }: HomeProps) {
  const [filter, setFilter] = useState("")
  const [actualFreelas, setActualFreelas] = useState<ResumeFreela[]>(freelas)

  const results = actualFreelas.length
  const resultText = results === 1 ? "Resultado" : "Resultados"

  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const filteredFreelas = freelas.filter(
      freela => freela.title.toLowerCase().includes(event.target.value.toLowerCase()) || freela.description.toLowerCase().includes(event.target.value.toLowerCase()) || freela.technologies.join(" ").toLowerCase().includes(event.target.value.toLowerCase())
    )

    setActualFreelas(filteredFreelas)
    setFilter(event.target.value);
  }

  return (
    <>
      <Head>
        <title>Codify Community</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <FormContainer>
        <Form onSubmit={e => { e.preventDefault(); }}>
          <h1>Code Freelas</h1>
          <p>Encontre freelancers para desenvolver seu projeto e encontre projetos para trabalhar.</p>
          <input type="text" value={filter} onChange={handleFilter} spellCheck={false} placeholder="Digite as palavras chave" />
        </Form>
      </FormContainer>

      <Content>
        <FreelasContainer>
          <Title text={`${results} ${resultText}`} />

          <Freelas>
            {actualFreelas.map(freela => (
              <FreelaCard
                key={freela.id}
                id={freela.id}
                title={freela.title}
                description={freela.description}
                price={freela.price}
                deadline={freela.deadline}
                technologies={freela.technologies}
                createdAt={freela.createdAt}
                user_id={freela.user_id}
                user_avatar={freela.user_avatar}
                user_name={freela.user_name}
              />
            ))}
          </Freelas>
        </FreelasContainer>
      </Content>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await codeFreelasApi.get('/freela');

  return {
    props: {
      freelas: response.data
    }
  }
}