/*********************************************************************************
*  WEB422 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Artem Pankov Student ID: 109060210 Date: 2 April 2023
*
*  Vercel App (Deployed) Link: _____________________________________________________
*
********************************************************************************/ 


import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { Card, Col, Container, Pagination, Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import ArtworkCard from '../../components/ArtworkCard';
import Error from 'next/error';

import validObjectIDList from '../../public/data/validObjectIDList.json';

const PER_PAGE = 12;

export default function Artwork() {

  const [artworkList, setArtworkList] = useState();
  const router = useRouter();
  const [page, setPage] = useState(1);

  let finalQuery = router.asPath.split('?')[1];

  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  function nextPage() {
    if (page < artworkList.length) {
      setPage(p => p + 1)
    }
  }

  function previousPage() {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }

  useEffect(() => {

    if (data) {
      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
      const results = [];

      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }

      setArtworkList(results);
      setPage(1);
    }

  }, [data])

  if (error) {
    return <Error statusCode={404} />
  }

  if (artworkList) {
    return (
      <>


        {artworkList.length > 0 ?

          <Row className="gy-4">{artworkList[page - 1]?.map(objID => (
            <Col lg={3} key={objID}><ArtworkCard objectID={objID} /></Col>
          ))}</Row>

          :

          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>Try searching for something else.
            </Card.Body>
          </Card>

        }



        {artworkList.length > 0 && <Row>

          <Col >
            <br />
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>

        }
      </>
    )
  } else {

    return null

  }
}




