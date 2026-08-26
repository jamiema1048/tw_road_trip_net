import styled from "styled-components";
import BottomNav from "../../(components)/(bottomnav)/BottomNav";

const NotFoundPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background);
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  padding: 3rem;
  gap: 1rem;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

const ErrorCodeText = styled.h1`
  color: var(--text-white-aaaa);
  font-family: "Highway Gothic Expanded";
  font-size: 7.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ErrorMessageText = styled.h1`
  color: var(--text-white-aaaa);
  font-family: "Microsoft JhengHei";
  font-size: 4.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const NotFoundClient: React.FC = () => (
  <NotFoundPageContainer>
    <ErrorCodeText>404</ErrorCodeText>
    <ErrorMessageText>找不到頁面</ErrorMessageText>
    <svg
      width="363"
      height="480"
      viewBox="0 0 363 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="31"
        y="364"
        width="312"
        height="40"
        fill={"var(--text-gray-a)"}
      />
      <rect
        x="31"
        y="436"
        width="312"
        height="40"
        fill={"var(--text-gray-a)"}
      />
      <rect
        x="31"
        y="292"
        width="312"
        height="40"
        fill={"var(--text-gray-a)"}
      />
      <rect
        x="31"
        y="220"
        width="312"
        height="40"
        fill={"var(--text-gray-a)"}
      />
      <rect
        x="31"
        y="148"
        width="312"
        height="40"
        fill={"var(--text-gray-a)"}
      />
      <rect
        y="73.5941"
        width="106"
        height="40"
        transform="rotate(-31 0 73.5941)"
        fill={"var(--text-gray-a)"}
      />
      <rect
        x="262.269"
        y="19"
        width="106"
        height="40"
        transform="rotate(24 262.269 19)"
        fill={"var(--text-gray-a)"}
      />
      <path
        d="M70.871 480H91V128.802L79.4258 86.3371L67.8516 66.2522L56.7806 41.0027L40.6774 0L38.6645 7.14539L33.129 4.27613V12.3101L27.5935 7.14539V17.4747L22.0581 9.4408L19.0387 17.4747L13 4.27613C13 54.6169 70.871 87.0618 70.871 128.802V480Z"
        fill={"var(--text-white-aaaa)"}
      />
      <path
        d="M283 480H303V125.167L307 93.0144L322 41.9139L363 9.76077L351.5 13.2057V9.76077L345.5 13.2057L348.5 6.88995L342.5 9.76077L345.5 2.87081L342.5 4.5933V0L310 33.3014L291.5 75.7895L283 125.167V480Z"
        fill={"var(--text-white-aaaa)"}
      />
    </svg>

    <BottomNav />
  </NotFoundPageContainer>
);
