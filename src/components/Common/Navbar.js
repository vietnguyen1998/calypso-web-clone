import React, { useEffect } from "react";
import { shortenAddress } from "../../utils/Utils";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  updateCalBalance,
  updateAddress,
  updateChainId,
  updateEthBalance,
  updateUsdtBalance,
} from "../../redux/actions";
import { toast } from "react-toastify";
import "./Navbar.css";
import { getWeb3 } from "../../utils/Contracts";
import { CHAIN_ID } from "../../config";

const NavBar = (props) => {
  const {
    updateCalBalance,
    updateAddress,
    updateChainId,
    updateEthBalance,
    updateUsdtBalance,
    reload,
  } = props;
  const calBalance = useSelector((state) => state.calBalance);
  const usdtBalance = useSelector((state) => state.usdtBalance);
  const ethBalance = useSelector((state) => state.ethBalance);
  const address = useSelector((state) => state.address);
  const chainId = useSelector((state) => state.chainId);
  const ethereum = window.ethereum;
  const history = useHistory();

  const connectMetamask = () => {
    ethereum &&
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountChange);
  };

  useEffect(() => {
    if (chainId && Number(chainId) != CHAIN_ID) {
      toast.error("We currently only support Ethereum Network");
    } else if (ethereum) {
      updateCalBalance(address);
      updateUsdtBalance(address);
      updateEthBalance(address);
    }
  }, [address, chainId, reload]);

  useEffect(() => {
    ethereum &&
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        updateChainId(Number(chainId));
      });
    ethereum &&
      ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
  }, []);

  const handleAccountChange = (accounts) => {
    if (accounts.length) {
      updateAddress(accounts[0]);
      getWeb3();
    }
  };

  useEffect(() => {
    ethereum &&
      ethereum.request({ method: "eth_accounts" }).then(handleAccountChange);

    ethereum && ethereum.on("accountsChanged", handleAccountChange);
    return () =>
      ethereum &&
      ethereum.removeListener("accountsChanged", handleAccountChange);
  }, []);

  if (!ethereum) {
    toast.error("Please install Metamask extension");
  }

  return (
    <div className="header">
      {/*  header */}
      <div style={{ backgroundColor: "#021025" }}>
        <div className="container pt-1" >
          <div className="row">
            <div
              className="col-md-8 my-auto"
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <div
                className="balance-box mt-2"
                style={{ marginRight: 16 }}
              >
                <span>{address ? usdtBalance.toFixed(2) : "0.00"} USDT</span>
              </div>
              <div
                className="balance-box mt-2"
                style={{ marginRight: 16 }}
              >
                <span>{address ? ethBalance.toFixed(8) : "0.00"} ETH</span>
              </div>
              <div
                className="balance-box mt-2"
              >
                <span>{address ? calBalance.toFixed(2) : "0.00"} FZL</span>
              </div>
              <button
                className="btn yellow-btn d-none d-md-block mt-2 ml-3"
                onClick={() => window.open("https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&outputCurrency=0xa5e23e0191605241f11854816ad5971ef6919f4c&inputCurrency=ETH")}
                style={{ minWidth: "100px", height: 35 }}
              >
                <small style={{ margin: "5px", fontSize: 16 }}>BUY FZL</small>
              </button>
            </div>
            <div
              className="col-md-4 mt-0"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                padding: 0,
              }}
            >
              <a className="d-none d-md-block" href="https://t.me/shibstakesentry" target="_blank">
                <img src="/images/reddit.png" style={{ width: "40px" }} />
              </a>
              <a className="d-none d-md-block" href="https://twitter.com/shibstakes" target="_blank">
                <img
                  src="/images/twitter.png"
                  style={{ width: "40px", marginRight: 16 }}
                />
              </a>
              {address ? (
                <div className="metamask-btn my-auto d-none d-md-block" align="right">
                  <span className="address-head small-text">
                    {shortenAddress(address)}
                  </span>
                </div>
              ) : (
                <div
                  className="metamask-btn my-auto d-none d-md-block"
                  align="right"
                  style={{ height: 35 }}
                >
                  <button
                    className="yellow-btn"
                    onClick={connectMetamask}
                  >
                    <span>Connect Metamask</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="navbar-box">
        <div className="container" style={{ padding: 0 }}>
          <nav className="navbar navbar-expand-lg navbar-light">
            <div
              className="logo ml-3"
              style={{ height: 56, display: "flex", alignItems: "center" }}
            >
              <a href="/">
                <img style={{ width: "190px" }} src="/images/logo.png" />
              </a>
            </div>
            <button
              className="navbar-toggler bg-white mr-3"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"

            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav navbar-right mx-auto">
                <li className="nav-item d-md-none">
                  <div className="d-flex px-2" style={{justifyContent: "space-between", alignItems: "center"}}>
                    <button
                      className="yellow-btn"
                      onClick={() => window.open("https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&outputCurrency=0xa5e23e0191605241f11854816ad5971ef6919f4c&inputCurrency=ETH")}
                    >
                      <span>BUY FZL</span>
                    </button>
                    {address ? (
                      <div className="metamask-btn" align="right">
                        <span className="address-head small-text">
                          {shortenAddress(address)}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="metamask-btn"
                        align="right"
                      >
                        <button
                          className="yellow-btn"
                          onClick={connectMetamask}
                        >
                          <span>Connect Metamask</span>
                        </button>
                      </div>
                    )}
                  </div>

                </li>
                <li className="nav-item">
                  <div
                    className="nav-link-box dropdown-toggle "
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="tab-list bold">Pools</span>
                  </div>

                  <div
                    className="dropdown-menu"
                    style={{
                      backgroundColor: "#0f1f38",
                      marginLeft: "20%",
                    }}
                  >
                    <div className="col ">
                      <div className="row justify-content-center">
                        <button
                          className="border-btn"
                          onClick={() => history.push("/pools")}
                          style={{ width: "90%" }}
                        >
                          Join Pool
                        </button>
                      </div>
                      <div className="row  justify-content-center">
                        <button
                          className="border-btn mt-2"
                          onClick={() => history.push("/create-pool")}
                          style={{ width: "90%" }}
                        >
                          Start Pool
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
                {/* <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/lottery" className="nav-link">
                      Lottery
                    </Link>
                  </div>
                </li> */}
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/tutorials" className="nav-link">
                      Tutorials
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/staking" className="nav-link">
                      Earn Rewards
                    </Link>
                  </div>
                </li>
                {/*
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/affiliate" className="nav-link">
                      Affiliates
                    </Link>
                  </div>
                </li> */}
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/about" className="nav-link">
                      About Us
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/my-pool" className="nav-link">
                      My Pools
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/my-page" className="nav-link">
                      My Page
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
    // <Row className='px-4 py-3 bg-secondary text-white justify-content-between'>
    //     <Col xs={4}>
    //         <Row>
    //             <Col xs={2}>
    //                 <Link to='/swap' className='text-white'>Swap</Link>
    //             </Col>
    //             <Col xs={2}>
    //                 <Link to='/pools' className='text-white'>Pools</Link>
    //             </Col>
    //             <Col xs={3}>
    //                 <Link to='/staking' className='text-white'>Staking</Link>
    //             </Col>
    //             <Col xs={3}>
    //                 <Link to='/affiliate' className='text-white'>Affiliate</Link>
    //             </Col>
    //             <Col xs={2}>
    //                 <Link to='/faucet' className='text-white'>Faucet</Link>
    //             </Col>

    //         </Row>
    //     </Col>
    //     <Col xs={8}>
    //         <Row>
    //             <Col xs={1}><Badge variant='info'>{getNetworkName(chainId)}</Badge></Col>
    //             <Col xs={2} className='justify-content-center'><Badge variant='info'>{usdtBalance.toFixed(1)} USDT</Badge></Col>
    //             <Col xs={2}><Badge variant='info'>{calBalance.toFixed(1)} FZL</Badge></Col>
    //             <Col xs={2}><Badge variant='info'>{ethBalance.toFixed(4)} ETH</Badge></Col>
    //             <Col xs={5} className='text-wrap'>
    //                 {   address ?
    //                     <Badge variant='info'>{address}</Badge> :
    //                     <Button variant='danger' onClick={connectMetamask}>Connect Metamask</Button>
    //                 }
    //             </Col>
    //         </Row>
    //     </Col>
    // </Row>
  );
};

export default connect(null, {
  updateCalBalance,
  updateAddress,
  updateChainId,
  updateEthBalance,
  updateUsdtBalance,
})(NavBar);
