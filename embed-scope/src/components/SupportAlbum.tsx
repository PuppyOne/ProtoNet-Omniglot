import { Card } from '@heroui/react';


export default function SupportAlbum() {
  return (
    <Card
      className='aspect-3/4'
      title='Support Album'
      description='This is a support album.'
    >
      <p>
        Here you can find various resources and information to help you with our
        product. If you have any questions or need assistance, please don't
        hesitate to reach out to our support team.
      </p>
      <ul>
        <li>
          <a href='https://support.example.com'>Support Center</a>
        </li>
        <li>
          <a href='https://docs.example.com'>Documentation</a>
        </li>
        <li>
          <a href='https://community.example.com'>Community Forums</a>
        </li>
      </ul>
    </Card>
  );
}
