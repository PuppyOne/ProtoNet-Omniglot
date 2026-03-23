import { Avatar, Card } from '@heroui/react';


export default function SupportAlbum() {
  return (
    <Card className='aspect-3/4 w-full' title='Support Album'>
      <Card.Header>
        <div className='aspect-square w-full'>
          <Avatar className='size-full rounded-xl'>
            <Avatar.Image src='https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg'></Avatar.Image>
            <Avatar.Fallback>
              PlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHold
            </Avatar.Fallback>
          </Avatar>
        </div>
      </Card.Header>
      <Card.Content>
        <div className='truncate'>
          PlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHoldPlaceHold
        </div>
      </Card.Content>
      <Card.Footer className='text-xs'>
        <div className='truncate'>PlaceHo111111111111ld</div>
        <div className='inline-block whitespace-nowrap'>个样本</div>
      </Card.Footer>
    </Card>
  );
}
