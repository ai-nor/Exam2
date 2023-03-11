/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

let email = faker.internet.email();
let password = faker.internet.password(12);
let userid;
let token;
let postid;

describe('API tests', () => {

  it.only('Registration and login', () => {
    
  cy.request({
    method: 'POST',
    url: '/register',
    body: {

      email: email,
      password: password

    },
    form: true
}).then( response => {
  expect (response.status).to.be.equal(201);
  console.log(response);

  cy.request({
    method: 'POST',
    url: '/login',
    body: {

      email: email,
      password: password

    }
  }).then( response => {
    expect (response.status).to.be.equal(200);
    console.log(response);
    userid = response.body.user.id;
    token=response.body.accessToken;
  })
})
})
  
  it('Get all posts', () => {
    cy.request('GET', '/posts').then (response =>{
      console.log(response.body);
      console.log(response.headers);

      expect (response.status).to.be.equal(200);
      expect(response.headers['content-type']).to.eq("application/json; charset=utf-8");

    })
  })

  it('Get only first 10 posts', () => {
    cy.request('GET', '/posts?_limit=10').then (response =>{
      console.log(response.body);

      expect (response.status).to.be.equal(200);
      expect(response.body.length).to.eq(10);

    })
  })

  it('Get posts with id = 55 and id = 60', () => {
    cy.request('GET', '/posts?_start=55&_end=60').then (response =>{
      console.log(response.body);

      expect (response.status).to.be.equal(200);
      expect(response.body.length).to.eq(5);
      expect(response.body[0].id).to.eq(56);
      expect(response.body[4].id).to.eq(60);

    })
  })
  
  it('Create a post', () => {
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: {
        text: 'text',
      },
      form: true,
      failOnStatusCode: false
  }).then( response => {
    expect (response.status).to.be.equal(401);
    })
  })

  it('Create post with adding access token in header', () => {
    cy.request({
      method: 'POST',
      url: '/664/posts',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        text: 'text',
      },
      form: true,
  }).then( response => {
      expect (response.status).to.be.equal(201);
      postid = response.body.id;

      cy.request('GET', `/posts/${postid}`).then (response =>{
        console.log(response.body);
      expect (response.status).to.be.equal(200);
      expect (response.body.id).to.be.equal(postid);
      expect (response.body.text).to.be.equal('text');
      })
    })
  })

  it('Create post entity and verify that the entity is created', () => {
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        text: 'text',
      },
      form: true,
  }).then( response => {
      expect (response.status).to.be.equal(201);
      postid = response.body.id;

      cy.request('GET', `/posts/${postid}`).then (response =>{
        console.log(response.body);
      expect (response.status).to.be.equal(200);
      expect (response.body.id).to.be.equal(postid);
      expect (response.body.text).to.be.equal('text');
      })
    })
  })

  it('Update non-existing entity', () => {
    
    let id = Math.round(Math.random()*10000);

    cy.request({
      method: 'PUT',
      url: `/posts/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        text: 'change text',
      },
      form: true,
      failOnStatusCode: false
  }).then( response => {
      expect (response.status).to.be.equal(404);
    })
  })

  it('Create post entity and update the created entity', () => {
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        text: 'text',
      },
      form: true,
  }).then( response => {
      expect (response.status).to.be.equal(201);
      postid = response.body.id;

      cy.request({
        method: 'PUT',
        url: `/posts/${postid}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          text: 'text changed',
        },
        form: true,
      }).then( response => {
      expect (response.status).to.be.equal(200);
      expect (response.body.text).to.be.equal('text changed');
      })
    })
  })

  it('Delete non-existing post entity', () => {
    
    let id = Math.round(Math.random()*10000);

    cy.request({
      method: 'DELETE',
      url: `/posts/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      failOnStatusCode: false
  }).then( response => {
      expect (response.status).to.be.equal(404);
    })
  })

  it('Create post entity, update the created entity, and delete the entity', () => {
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        text: 'text',
      },
      form: true,
    }).then( response => {
      expect (response.status).to.be.equal(201);
      postid = response.body.id;

      cy.request({
        method: 'PUT',
        url: `/posts/${postid}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          text: 'text changed',
        },
        form: true,
      }).then( response => {
      expect (response.status).to.be.equal(200);
      expect (response.body.text).to.be.equal('text changed');
  
        cy.request({
          method: 'DELETE',
          url: `/posts/${postid}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
        }).then( response => {
        expect (response.status).to.be.equal(200);

        cy.request({
          method: 'GET',
          url: `/posts/${postid}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          failOnStatusCode: false
        }).then (response =>{
          expect (response.status).to.be.equal(404);

          })

    })
  })
  })

  })
})
