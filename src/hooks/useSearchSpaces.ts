import { useAdapter } from "context/AdapterContext";
import { Space, SpaceState } from "models/Space";
import { useRouter } from "next/dist/client/router";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { keywordsAtom, spaceStateAtom } from "store";

export const useSearchSpaces = () => {
  const router = useRouter();
  const { spaceRepo } = useAdapter();
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const [spaceState, setSpaceState] = useAtom(spaceStateAtom);
  const [spaces, setSpaces] = useState<Space[]>();
  const [isLoading, setIsLoading] = useState(false);
  const _keywords =
    typeof router.query.keywords === "string"
      ? router.query.keywords
      : undefined;
  const _spaceState =
    typeof router.query.state === "string" ? router.query.state : undefined;

  useEffect(() => {
    // if (!router.isReady) return;
    setInitialState();
  }, [_keywords, _spaceState]);

  useEffect(() => {
    searchSpaces();
  }, [spaceState]);

  const searchSpaces = async (event?: FormEvent) => {
    if (!keywords) return;
    event?.preventDefault();
    setIsLoading(true);
    const keywordsArr = keywords.split(" ");
    const spaces = await spaceRepo.getListByKeywords(keywordsArr, spaceState);

    updateUrl();
    setSpaces(spaces);
    setIsLoading(false);
  };

  const _searchSpaces = async (
    keywords: string,
    spaceState: SpaceState | undefined
  ) => {
    if (!keywords) return;
    setIsLoading(true);
    const keywordsArr = keywords.split(" ");
    const spaces = await spaceRepo.getListByKeywords(keywordsArr, spaceState);

    setSpaces(spaces);
    setIsLoading(false);
  };

  const updateUrl = () => {
    const keywordsArr = keywords.split(" ");
    const _keywords = keywordsArr.join(",");
    let query = `?keywords=${_keywords}`;
    if (spaceState) {
      query += `&state=${spaceState}`;
    }
    router.push(`/${query}`);
  };

  const setInitialState = () => {
    if (_keywords) {
      const keywordsStr = _keywords.split(",").join(" ");
      setKeywords(keywordsStr);
    }

    if (
      _spaceState === "live" ||
      _spaceState === "scheduled" ||
      _spaceState === undefined
    ) {
      setSpaceState(_spaceState);
    }

    if (
      _keywords &&
      (_spaceState === "live" ||
        _spaceState === "scheduled" ||
        _spaceState === undefined)
    ) {
      _searchSpaces(_keywords, _spaceState);
    }
  };

  const onChangeKeywords: ChangeEventHandler<HTMLInputElement> = (event) => {
    const keywords = event.target.value;
    setKeywords(keywords);
  };

  const onChangeState: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    if (value === "live" || value === "scheduled" || value === "none") {
      setSpaceState(value === "none" ? undefined : value);
    }
  };

  return {
    spaces,
    keywords,
    spaceState,
    isLoading,
    searchSpaces,
    onChangeKeywords,
    onChangeState,
  };
};
