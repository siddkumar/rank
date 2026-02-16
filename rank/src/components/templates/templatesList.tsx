"use client"

import React, { useEffect, useState } from "react";
import { ExistingTemplateStub } from "./templates";
import { ExistingRankStub } from "../../models/ExistingRankStub";
import { useDB } from "../../services/dbProvider";
import { Firestore } from "@firebase/firestore";
import { DeleteRank } from "../../lib/ranksService";
import { Icon } from "../common/Icon";
import styles from "./templatesList.module.css"

export interface TemplatesListProps {
  stubs: ExistingTemplateStub[];
}

export interface RanksListProps {
  stubs: ExistingRankStub[];
}

export function TemplatesList(props: TemplatesListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(props.stubs.length / itemsPerPage);

  // Reset to first page when stubs change
  useEffect(() => {
    setCurrentPage(0);
  }, [props.stubs]);

  // Calculate which items to show
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = props.stubs.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <>
      <div className="list-container">
        {currentItems.map((stub, _s) => {
          return (
            <a
              className="template-link item-container card row"
              key={stub.id}
              href={"/template/" + stub.id}
            >
              {stub.name}
              {stub.images.length > 2 ? (
                <div key={stub.id} className="controls">
                  {stub.images[0] && <img src={stub.images[0]} alt={"i"} className={styles.glyphStub} />}
                  {stub.images[1] && <img src={stub.images[1]} alt={"i"} className={styles.glyphStub} />}
                  {stub.images[2] && <img src={stub.images[2]} alt={"i"} className={styles.glyphStub} />}
                </div>
              ) : (
                <></>
              )}
            </a>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationArrow}
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
          >
            <Icon className="fa-solid fa-chevron-left" />
          </button>

          <div className={styles.paginationDots}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`${styles.paginationDot} ${
                  index === currentPage ? styles.activeDot : ""
                }`}
                onClick={() => goToPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <button
            className={styles.paginationArrow}
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
          >
            <Icon className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </>
  );
}

export function RanksList(props: RanksListProps) {
  const db = useDB().db;
  const [rankList, setRankList] = useState(props.stubs);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(rankList.length / itemsPerPage);

  useEffect(() => {
    setRankList(props.stubs);
    setCurrentPage(0);
  }, [props.stubs]);

  // Calculate which items to show
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = rankList.slice(startIndex, endIndex);

  function deleteRank(s: ExistingRankStub, i: number, db: Firestore) {
    const updatedList = rankList.slice(0, i).concat(rankList.slice(i + 1));
    DeleteRank(db, s.id);
    setRankList(updatedList);
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <>
      <div className="list-container">
        {currentItems.map((stub, i) => {
          return (
            <div className="item-container card row" key={stub.id}>
              <a
                className="template-link row"
                key={stub.id}
                href={"/rank/edit/" + stub.id}
              >
                {stub.name}{" "}
                {stub.images.length > 2 ? (
                  <div key={stub.id} className="controls-rank">
                    {stub.images[0] && <img src={stub.images[0]} alt={"i"} className={styles.glyphStub} />}
                    {stub.images[1] && <img src={stub.images[1]} alt={"i"} className={styles.glyphStub} />}
                    {stub.images[2] && <img src={stub.images[2]} alt={"i"} className={styles.glyphStub} />}
                  </div>
                ) : (
                  <></>
                )}
              </a>
              <Icon
                onClick={() => deleteRank(stub, startIndex + i, db!)}
                className="fa-regular fa-trash-can"
              />
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationArrow}
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
          >
            <Icon className="fa-solid fa-chevron-left" />
          </button>

          <div className={styles.paginationDots}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`${styles.paginationDot} ${
                  index === currentPage ? styles.activeDot : ""
                }`}
                onClick={() => goToPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <button
            className={styles.paginationArrow}
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
          >
            <Icon className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </>
  );
}
