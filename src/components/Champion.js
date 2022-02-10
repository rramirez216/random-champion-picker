import React from 'react'
import styled from 'styled-components'

const Champion = ({ champion: { id, name, title } }) => {
  return (
    <Wrapper>
      <div>
        <img
          src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`}
          alt=''
        />
      </div>
      <Name>{name}</Name>
      <Title>{title}</Title>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: center;
`
const Name = styled.p`
  font-size: 3rem;
`
const Title = styled.p`
  font-size: 1.5rem;
`

export default Champion
