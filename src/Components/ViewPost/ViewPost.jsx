import styled from 'styled-components';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import useViewPostLogic from './Logic/useViewPostLogic';

const ViewPost = () => {
  const { closeViewPost } = useViewPostLogic();

  return (
    <Wrapper>
      <div className='center_box flex'>
        <div className='images'>
          <img src='https://i.pravatar.cc/300' alt='a' />
        </div>

        <div className='right_part flex'>
          <div className='top flex'>
            <div className='dp'>
              <img src='https://i.pravatar.cc/300' alt='a' />
            </div>

            <p className='username'>ddepu11</p>
          </div>

          <div className='middle_part'>
            <div className='row use_cap_row flex'>
              <div className='upper_section flex'>
                <div className='dp'>
                  <img src='https://i.pravatar.cc/300' alt='a' />
                </div>

                <div className='caption'>
                  <p>
                    <span className='username'>ddepu11</span> तेरे साये में हम
                    सबकी आज़ादी आबाद रहे हर ग़ुलामी से हमारा प्यारा तिरंगा आज़ाद
                    रहे
                  </p>
                </div>
              </div>
              <p className='when_uploaded'>6w</p>
            </div>
          </div>
        </div>
      </div>

      <CloseOutlined className='ic_close' onClick={closeViewPost} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-content: center;
  z-index: 15;

  .center_box {
    width: 50vw;
    font-size: 0.95em;
    justify-content: flex-start;

    .images {
      width: 400px;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .right_part {
      background-color: #e4e4e4;
      height: 100%;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;

      .dp {
        width: 40px;
        height: 40px;
        margin-right: 10px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .top {
        border-bottom: 1px solid #d6d5d5;
        padding: 15px 20px;
      }

      .middle_part {
        padding: 15px 20px;

        .use_cap_row {
          font-size: 0.97em;
          padding-top: 10px;
          flex-direction: column;
          align-items: flex-start;

          .caption {
            .username {
              font-weight: 700;
            }
            color: #292929;

            width: 90%;
          }

          .when_uploaded {
            color: #969696;
            padding: 8px 0 0 50px;
            font-size: 0.9em;
          }
        }
      }
    }
  }

  .ic_close {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #e7e7e7;
    font-size: 2.2em;
  }

  .ic_close:hover {
    cursor: pointer;
  }
`;

export default ViewPost;
